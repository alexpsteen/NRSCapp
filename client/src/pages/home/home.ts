import { Component } from '@angular/core'

import {NavController, NavParams} from 'ionic-angular'

import _ from 'lodash';

import {EventDetailsPage} from "../event-details/event-details";
import {EventStore} from "../../app/event.store";
import {EventOverviewPage} from "../event-overview/event-overview";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {List} from "immutable";
import {IEvent} from "../../app/event.interface";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public events: BehaviorSubject<List<IEvent>> = new BehaviorSubject(List([]));

  constructor(
    public navCtrl: NavController,
    public eventStore: EventStore,
    public navParams: NavParams) { }

  ionViewDidEnter() {
    this.loadData();
  }

  loadData(): Observable<IEvent[]> {
    let obs = this.eventStore.getEvents();
    obs.subscribe(events => {
      this.events.next(List(this.sortEvents(events)));
    });
    return obs;
  }

  doRefresh (refresher?) {
    let subscription = this.loadData().subscribe({
      complete: () => {
        if (subscription) {
          subscription.unsubscribe();
        }
        if (refresher) {
          refresher.complete();
        }
      },
      error: (err) => {
        if (subscription) {
          subscription.unsubscribe();
        }
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
        event: event,
        parentPage: this
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

  private sortEvents (events:IEvent[]): IEvent[] {
    return _.orderBy(events, ['event_date_start', 'event_name'], ['asc', 'asc'])
  }
}
