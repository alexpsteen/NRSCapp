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
    this.refresh();
  }

  get events () { return Observable.create( fn => this._events.subscribe(fn) ) }

  getEvents (): Observable<IEvent[]> {
    return this.auth.getCredentials().map(creds =>
      this.sigv4.get(this.endpoint, `events/customer`, creds)).concatAll().share().map(this.multipleResult);
  }

  getEventsByCustomerId (): Observable<IEvent[]> {
    return this.auth.getCredentials().map(creds =>
        this.sigv4.get(this.endpoint, `events/customer`, creds)).concatAll().share().map(this.multipleResult);
  }

  getAllEvents (): Observable<IEvent[]> {
    return this.auth.getCredentials().map(creds =>
        this.sigv4.get(this.endpoint, `events/all`, creds)).concatAll().share().map(this.multipleResult);
  }

  getEventByEventId (eventId): Observable<IEvent> {
    return this.auth.getCredentials().map(creds =>
        this.sigv4.get(this.endpoint, `events/event/${eventId}`, creds)).concatAll().share().map(this.singularResult);
  }

  getEventsByEventPlannerId (): Observable<IEvent[]> {
    return this.auth.getCredentials().map(creds =>
        this.sigv4.get(this.endpoint, `events/eventPlanner`, creds)).concatAll().share().map(this.multipleResult);
  }

  getEventsByVendorId (): Observable<IEvent[]> {
    return this.auth.getCredentials().map(creds =>
      this.sigv4.get(this.endpoint, `events/vendor`, creds)).concatAll().share().map(this.multipleResult);
  }

  getPublishedEvents (): Observable<IEvent[]> {
    return this.auth.getCredentials().map(creds =>
        this.sigv4.get(this.endpoint, `events/published`, creds)).concatAll().share().map(this.multipleResult);
  }

  getInProgressEvents (): Observable<IEvent[]> {
    return this.auth.getCredentials().map(creds =>
        this.sigv4.get(this.endpoint, `events/inProgress`, creds)).concatAll().share().map(this.multipleResult);
  }

  addEvent (event): Observable<IEvent> {
    let observable = this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, `events`, event, creds)).concatAll().share();

    observable.subscribe(resp => {
      if (resp.status === 200 && resp.json() == 1) {
        let events = this._events.getValue().toArray();
        events.push(event);
        this._events.next(List(this.sort(events)));
      }
    });
    return observable.map(resp => resp.status === 200 ? resp.json() : null);
  }

  updateEvent (event): Observable<IEvent>{
    return this.auth.getCredentials().map(creds =>
        this.sigv4.put(this.endpoint, `events/editProfile/${event.event_id}`, event, creds)).concatAll().share().map(this.singularResult);
  }

  assignEventPlanner(eventId, eventPlannerId): Observable<IEvent>{
    return this.auth.getCredentials().map(creds =>
        this.sigv4.put(this.endpoint, `events/assignEventPlanner/${eventId}/${eventPlannerId}`,null,creds)).concatAll().share().map(this.singularResult);
  }

  publishEvent(eventId): Observable<IEvent>{
    return this.auth.getCredentials().map(creds =>
        this.sigv4.put(this.endpoint, `events/publishEvent/${eventId}`, null, creds)).concatAll().share().map(this.singularResult);
  }

  deleteEvent(eventId): Observable<IEvent>{
    return this.auth.getCredentials().map(creds =>
        this.sigv4.del(this.endpoint, `events/deleteEvent/${eventId}`, creds)).concatAll().share().map(this.singularResult);
  }

  private sort (events:IEvent[]): IEvent[] {
    return _.orderBy(events, ['event_date_start', 'event_name'], ['asc', 'asc'])
  }

  private singularResult(resp) {
    return resp.status === 200 ? resp.json() : null;
  }

  private multipleResult(resp) {
    if (resp.status === 200) {
      let data = resp.json();
      if (data && !Array.isArray(data)) {
        return [data];
      }
      return data;
    }
    return [];
  }






  refresh () : Observable<any> {
    if (this.auth.isUserSignedIn()) {
      let observable = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, 'events/customer', creds)).concatAll().share();
      observable.subscribe(resp => {
        let data = resp.json();
        if (data) {
          if (!Array.isArray(data)) {
            data = [data];
          }
          this._events.next(List(this.sort(data)));
        } else {
          this._events.next(List([]));
        }
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