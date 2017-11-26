import { Injectable } from '@angular/core'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/concatAll'
import 'rxjs/add/operator/share'
import { List } from 'immutable'
import { Sigv4Http } from './sigv4.service'
import _ from 'lodash'
import { Config } from 'ionic-angular'
import { AuthService } from './auth.service'
import { IEvent } from "./event.interface";

let eventStoreFactory = (sigv4: Sigv4Http, auth: AuthService, config: Config) => { return new EventStore(sigv4, auth, config) };

export let EventStoreProvider = {
  provide: EventStore,
  useFactory: eventStoreFactory,
  deps: [Sigv4Http, AuthService]
};

@Injectable()
export class EventStore {

  private _events: BehaviorSubject<List<IEvent>> = new BehaviorSubject(List([]));
  private endpoint:string;

  constructor (private sigv4: Sigv4Http, private auth: AuthService, private config: Config) {
    this.endpoint = this.config.get('APIs')['EventsAPI'];
  }

   get events () { return Observable.create( fn => this._events.subscribe(fn) ) }

  getUserId (): Observable<any>{
        let obs = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, 'users/self', creds)).concatAll().share();

        return obs.map(resp => resp.status === 200 ? resp.json().userId : null)
    }

    getEventByCustomerId (): Observable<IEvent> {
        let obs = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `events/customer`, creds)).concatAll().share();

        return obs.map(resp => resp.status === 200 ? resp.json() : null)
    }

    getAllEvents (): Observable<IEvent> {
        let obs = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `events/all`, creds)).concatAll().share();

        return obs.map(resp => resp.status === 200 ? resp.json() : null)
    }

    getEventByEventId (eventId): Observable<IEvent> {
        let events = this._events.getValue().toArray();
        let obs = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `events/event/${eventId}`, creds)).concatAll().share();

        return obs.map(resp => resp.status === 200 ? resp.json() : null)
    }

    getEventByEventPlannerId (): Observable<IEvent> {
        let id = this.getUserId();
        let obs = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `events/eventPlanner/${id}`, creds)).concatAll().share();

        return obs.map(resp => resp.status === 200 ? resp.json() : null)
    }

    getCompletedEvents (): Observable<IEvent> {
        let obs = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `events/completed`, creds)).concatAll().share();

        return obs.map(resp => resp.status === 200 ? resp.json() : null)
    }

    getInProgressEvents (): Observable<IEvent> {
        let obs = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `events/inProgress`, creds)).concatAll().share();

        return obs.map(resp => resp.status === 200 ? resp.json() : null)
    }

    addEvent (event): Observable<IEvent> {
        let userId = this.getUserId();
        let observable = this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, `events/insert/${userId}`, event, creds)).concatAll().share();

        observable.subscribe(resp => {
            if (resp.status === 200) {
                let events = this._events.getValue().toArray();
                let event = resp.json().event;
                events.push(event);
                this._events.next(List(this.sort(events)));
            }
        });
        return observable.map(resp => resp.status === 200 ? resp.json().event : null);


    }

    editEvent (event): Observable<IEvent>{
        let obs = this.auth.getCredentials().map(creds => this.sigv4.put(this.endpoint, `events/editProfile/${event.eventId}`, event, creds)).concatAll().share();
        return obs.map(resp => resp.status === 200 ? resp.json().event : null);
    }

    assignEventPlanner(event, eventId): Observable<IEvent>{
        let id = this.getUserId();
        let obs = this.auth.getCredentials().map(creds => this.sigv4.put(this.endpoint, `events/assignEventPlanner/${eventId}/${id}`,event,creds)).concatAll().share();
        return obs.map(resp => resp.status === 200 ? resp.json().event : null);
    }

    completeEvent(event, eventId): Observable<IEvent>{
        let obs = this.auth.getCredentials().map(creds => this.sigv4.put(this.endpoint, `events/completeEvent/${eventId}`, event, creds)).concatAll().share();
        return obs.map(resp => resp.status === 200 ? resp.json().event : null);
    }

    deleteEvent(eventId): Observable<IEvent>{
      let obs = this.auth.getCredentials().map(creds => this.sigv4.del(this.endpoint, `events/completeEvent/${eventId}`, creds)).concatAll().share();
      return obs.map(resp => resp.status === 200 ? resp.json().event : null);
    }

    private sort (events:IEvent[]): IEvent[] {
        return _.orderBy(events, ['startDate', 'name'], ['asc', 'asc'])
    }







  refresh () : Observable<any> {
    if (this.auth.isUserSignedIn()) {
      let observable = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, 'events/customer', creds)).concatAll().share();
      observable.subscribe(resp => {
        console.log(resp);
        let data = resp.json();
        this._events.next(List(this.sort(data.events)));
      }, err => {
        // must be defined so not ignored in the chain
      });
      return observable;
    } else {
      this._events.next(List([]));
      return Observable.from([]);
    }
  }



  // getEvent (index): Observable<IEvent> {
  //   let events = this._events.getValue().toArray();
  //   let obs = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `events/${events[index].eventId}`, creds)).concatAll().share();
  //
  //   return obs.map(resp => resp.status === 200 ? resp.json().events[0] : null)
  // }



  // updateEvent (event): Observable<IEvent> {
  //   let events = this._events.getValue().toArray();
  //   let obs = this.auth.getCredentials().map(creds => this.sigv4.put(
  //     this.endpoint,
  //     `events/${event.eventId}`,
  //     event,
  //     creds)).concatAll().share();
  //
  //   obs.subscribe(resp => {
  //     if (resp.status === 200) {
  //       const retEvent = resp.json().event;
  //       let index = _.findIndex(events, (e) => {return e.eventId === retEvent.eventId} );
  //       events[index] = retEvent;
  //       this._events.next(List(this.sort(events)))
  //     }
  //   });
  //
  //   return obs.map(resp => resp.status === 200 ? resp.json().event : null)
  // }
  //
  // deleteEvent (eventId): Observable<IEvent> {
  //   let events = this._events.getValue().toArray();
  //   let obs = this.auth.getCredentials().map(creds => this.sigv4.del(this.endpoint, `events/${eventId}`, creds)).concatAll().share();
  //
  //   obs.subscribe(resp => {
  //     if (resp.status === 200) {
  //       let index = _.findIndex(events, (e) => {return e.eventId === eventId} );
  //       events.splice(index, 1)[0];
  //       this._events.next(List(<IEvent[]>events));
  //     }
  //   });
  //   return obs.map(resp => resp.status === 200 ? resp.json().event : null)
  // }
  //


}