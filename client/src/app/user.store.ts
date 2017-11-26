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
import {IUser, IVendor} from "./user.interface";

let userStoreFactory = (sigv4: Sigv4Http, auth: AuthService, config: Config) => { return new UserStore(sigv4, auth, config) };

export let UserStoreProvider = {
  provide: UserStore,
  useFactory: userStoreFactory,
  deps: [Sigv4Http, AuthService]
};

@Injectable()
export class UserStore {

  private _vendors: BehaviorSubject<List<IVendor>> = new BehaviorSubject(List([]));
  private endpoint:string;

  constructor (private sigv4: Sigv4Http, private auth: AuthService, private config: Config) {
    this.endpoint = this.config.get('APIs')['UsersAPI'];
  }

  get vendors () { return Observable.create( fn => this._vendors.subscribe(fn) ) }

  refresh () : Observable<any> {
    if (this.auth.isUserSignedIn()) {
      let observable = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, 'events/all?type=vendor', creds)).concatAll().share();
      observable.subscribe(resp => {
        console.log(resp);
        let data = resp.json();
        this._vendors.next(List(this.sort(data.vendors)));
      });
      return observable;
    } else {
      this._vendors.next(List([]));
      return Observable.from([]);
    }
  }

  addUser (user): Observable<IUser> {
    let observable = this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, 'users', user, creds)).concatAll().share();

    observable.subscribe(resp => {
      if (resp.status === 200) {
        console.log(`user added: ${resp.json()}`);
      }
    });
    return observable.map(resp => resp.status === 200 ? resp.json() : null);
  }

  // getUser (index): Observable<IUser> {
  //   let events = this._events.getValue().toArray();
  //   let obs = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `events/${events[index].eventId}`, creds)).concatAll().share();
  //
  //   return obs.map(resp => resp.status === 200 ? resp.json().events[0] : null)
  // }

  getCurrentUser (): Observable<IUser> {
    let obs = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, 'users?type=self', creds)).concatAll().share();

    return obs.map(resp => resp.status === 200 ? resp.json() : null)
  }

  getCurrentVendor (): Observable<IVendor> {
    let obs = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint,'users?type=vendorSelf', creds)).concatAll().share();

    return obs.map(resp => resp.status === 200 ? resp.json() : null);
  }


  getVendorById (id): Observable<IUser> {
    let obs = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `users?type=vendor&id=${id}`, creds)).concatAll().share();

    return obs.map(resp => resp.status === 200 ? resp.json() : null)
  }

  verifyVendor (id) :Observable<IVendor> {
      let obs = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `users?type=vendor&id=${id}&task=verify`, creds)).concatAll().share();

      return obs.map(resp => resp.status === 200 ? resp.json() : null);
  }

  

  updateUser (user): Observable<IUser> {
    let obs = this.auth.getCredentials().map(creds => this.sigv4.put(
        this.endpoint,
        `users/${user.userId}`,
        user,
        creds)).concatAll().share();

    // obs.subscribe(resp => {
    //   if (resp.status === 200) {
    //     const retUser = resp.json();
    //     let index = _.findIndex(events, (e) => {return e.eventId === retEvent.eventId} );
    //     events[index] = retEvent;
    //     this._events.next(List(this.sort(events)))
    //   }
    // });

    return obs.map(resp => resp.status === 200 ? resp.json() : null)
  }

  deleteUser (userId): Observable<IUser> {
    let obs = this.auth.getCredentials().map(creds => this.sigv4.del(this.endpoint, `users/${userId}`, creds)).concatAll().share();

    obs.subscribe(resp => {
      if (resp.status === 200) {
        console.log(`user deleted: ${resp.json()}`);
      }
    });
    return obs.map(resp => resp.status === 200 ? resp.json() : null);
  }

  private sort (users:IVendor[]): IVendor[] {
    return _.orderBy(users, ['lastName', 'firstName'], ['asc', 'asc']);
  }

}