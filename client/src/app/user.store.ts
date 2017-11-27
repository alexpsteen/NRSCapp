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

  private endpoint:string;

  constructor (private sigv4: Sigv4Http, private auth: AuthService, private config: Config) {
    this.endpoint = this.config.get('APIs')['UsersAPI'];
  }

  getPlanners (): Observable<IVendor[]> {
    return this.auth.getCredentials().map(creds =>
        this.sigv4.get(this.endpoint, 'users/all?type=planner', creds)).concatAll().share().map(this.multipleResult);
  }

  getVendors (): Observable<IVendor[]> {
    return this.auth.getCredentials().map(creds =>
        this.sigv4.get(this.endpoint, 'users/all?type=vendor', creds)).concatAll().share().map(this.multipleResult);
  }

  addUser (user): Observable<IUser> {
    return this.auth.getCredentials().map(creds =>
        this.sigv4.post(this.endpoint, 'users', user, creds)).concatAll().share().map(this.singularResult);
  }

  getCurrentUser (): Observable<IUser> {
    return this.auth.getCredentials().map(creds =>
        this.sigv4.get(this.endpoint, 'users?type=self', creds)).concatAll().share().map(this.singularResult);
  }

  getCurrentVendor (): Observable<IVendor> {
    return this.auth.getCredentials().map(creds =>
        this.sigv4.get(this.endpoint,'users?type=vendorSelf', creds)).concatAll().share().map(this.singularResult);
  }

  getUserById (id): Observable<IUser> {
    return this.auth.getCredentials().map(creds =>
        this.sigv4.get(this.endpoint,`users?type=any&id=${id}`, creds)).concatAll().share().map(this.singularResult);
  }

  getVendorById (id): Observable<IVendor> {
    return this.auth.getCredentials().map(creds =>
        this.sigv4.get(this.endpoint, `users?type=vendor&id=${id}`, creds)).concatAll().share().map(this.singularResult);
  }

  verifyVendor (id) :Observable<IVendor> {
    return this.auth.getCredentials().map(creds =>
        this.sigv4.get(this.endpoint, `users?type=vendor&id=${id}&task=verify`, creds)).concatAll().share().map(this.singularResult);
  }

  deactivateVendor (id) :Observable<IVendor> {
    return this.auth.getCredentials().map(creds =>
        this.sigv4.get(this.endpoint, `users?type=vendor&id=${id}&task=deactivate`, creds)).concatAll().share().map(this.singularResult);
  }

  updateUser (user): Observable<IUser> {
    return this.auth.getCredentials().map(creds =>
        this.sigv4.put(this.endpoint, `users/${user.userId}`, user, creds)).concatAll().share().map(this.singularResult);
  }

  deleteUser (userId): Observable<IUser> {
    return this.auth.getCredentials().map(creds =>
        this.sigv4.del(this.endpoint, `users/${userId}`, creds)).concatAll().share().map(this.singularResult);
  }

  private sort (users:IVendor[]): IVendor[] {
    return _.orderBy(users, ['last_name', 'first_name'], ['asc', 'asc']);
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

}