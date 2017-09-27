import { Injectable } from '@angular/core'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/concatAll'
import 'rxjs/add/operator/share'
import { List } from 'immutable'
import { IProject } from './project.interface'
import { Sigv4Http } from './sigv4.service'
import * as _keyBy from 'lodash.keyby'
import * as _values from 'lodash.values'
import { Config } from 'ionic-angular'
import { AuthService } from './auth.service'

let eventStoreFactory = (sigv4: Sigv4Http, auth: AuthService, config: Config) => { return new EventStore(sigv4, auth, config) };

export let EventStoreProvider = {
  provide: EventStore,
  useFactory: eventStoreFactory,
  deps: [Sigv4Http, AuthService]
};

@Injectable()
export class EventStore {

  private endpoint:string;

  constructor (private sigv4: Sigv4Http, private auth: AuthService, private config: Config) {
    this.endpoint = this.config.get('APIs')['EventsAPI'];
    // this.refresh();
  }

}