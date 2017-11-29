import { Component } from '@angular/core'

import {NavController, NavParams} from 'ionic-angular'

import {EventDetailsPage} from "../event-details/event-details";
import {EventStore} from "../../app/event.store";
import {EventOverviewPage} from "../event-overview/event-overview";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(
    public navCtrl: NavController,
    public eventStore: EventStore,
    public navParams: NavParams) { }

  doRefresh (refresher?) {
    let subscription = this.eventStore.refresh().subscribe({
      complete: () => {
        subscription.unsubscribe();
        if (refresher) {
          refresher.complete();
        }
      },
      error: (err) => {
        subscription.unsubscribe();
        if (refresher) {
          refresher.complete();
        }
      }
    });
  }

  addTapped() {
    this.navCtrl.push(EventDetailsPage, {
      title: 'Edit Event Details'
    });
  }

  gotoEvent(eventId) {
    this.eventStore.getEventByEventId(eventId).subscribe(event => {
      if (!event) { return console.log('could not find event. Please check logs') }

      this.navCtrl.push(EventOverviewPage, {
        user_type: this.navParams.get('user_type'),
        event: event
      });
    });
  }

  getIconColor(event) {
    switch(event.event_status) {
      case 0:
        return 'primary';
      case 1:
        return 'secondary';
      default:
        return 'primary';
    }
  }

  getIcon(event) {
    switch(event.event_status) {
      case 0:
        return 'alert';
      case 1:
        return 'checkmark-circle';
      default:
        return 'alert';
    }
  }
}
