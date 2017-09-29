import { Component } from '@angular/core'

import {NavController, NavParams} from 'ionic-angular'

import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'
import { AuthService } from '../../app/auth.service'

import UUID from 'uuid'

import {EventStore} from "../../app/event.store";
import {IEvent} from "../../app/event.interface";

@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details.html'
})
export class EventDetailsPage {
  event:IEvent = {
    eventId: null,
    name: null,
    startDate: null,
    endDate: null,
    budget: null
  };

  private parentPage;

  constructor(
    public navCtrl: NavController,
    public auth: AuthService,
    public store: EventStore,
    public navParams: NavParams) {
    if (this.navParams.get('event')) {
      this.event = this.navParams.get('event');
    }
    if (this.navParams.get('parentPage')) {
      this.parentPage = this.navParams.get('parentPage');
    }
  }

  get userColor ():string {
    return this.auth.isUserSignedIn() ? 'secondary' : 'primary'
  }

  saveEvent () {
    if (this.event.eventId) {
      this.store.updateEvent(this.event).subscribe(event => {
        if (event) {
          this.parentPage.doRefresh();
          this.navCtrl.pop();
        } else {
          console.log('Could not update event. Please see logs');
        }
      });
    } else {
      this.event.eventId = UUID.v4();
      this.store.addEvent(this.event).subscribe(event => {
        if (event) {
          this.navCtrl.pop();
        } else {
          console.log('Could not add event. Please see logs');
        }
      });
    }
  }
}
