import { Component } from '@angular/core'

import { NavController } from 'ionic-angular'
import { ModalController } from 'ionic-angular'

import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'
import { AuthService } from '../../app/auth.service'

import * as moment from 'moment'

// import _ from 'lodash'
import * as _groupBy from 'lodash.groupby'
import * as _map from 'lodash.map'
import { List } from 'immutable'

import {EventDetailsPage} from "../event-details/event-details";
import {EventStore} from "../../app/event.store";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public auth: AuthService,
    public eventStore: EventStore) { }

  // ionViewDidEnter() {
  //   this.doRefresh();
  // }

  doRefresh (refresher?) {
    let subscription = this.eventStore.refresh().subscribe({
      complete: () => {
        subscription.unsubscribe();
        if (refresher) {
          refresher.complete();
        }
      }
    })
  }

  addTapped() {
    this.navCtrl.push(EventDetailsPage);
  }

  editEvent(index) {
    this.eventStore.getEvent(index).subscribe(event => {
      if (!event) { return console.log('could not find event. Please check logs') }

      this.navCtrl.push(EventDetailsPage, {
        event: event,
        parentPage: this
      });
    })
  }

  get userColor ():string {
    return this.auth.isUserSignedIn() ? 'secondary' : 'primary'
  }
}
