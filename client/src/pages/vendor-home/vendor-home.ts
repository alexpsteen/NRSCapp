import { Component } from '@angular/core'

import {NavController, NavParams} from 'ionic-angular'
import { ModalController } from 'ionic-angular'

import _ from 'lodash';

import { AuthService } from '../../app/auth.service'

import {EventDetailsPage} from "../event-details/event-details";
import {EventStore} from "../../app/event.store";
import {EventOverviewPage} from "../event-overview/event-overview"
import {EventList} from "../event-list/event-list"
import {ReadMessage} from "../read-message/read-message"
import {VendorProfilePage} from "../vendor-profile/vendor-profile";
import {IVendorLite} from "../../app/user.interface";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {List} from "immutable";
import {IEvent} from "../../app/event.interface";
import {Observable} from "rxjs/Observable";

let Rx = require('rxjs/Rx');

@Component({
  selector: 'page-vendor-home',
  templateUrl: 'vendor-home.html'
})
export class VendorHomePage {

  tabs:string = 'myEvents';

  public vendor:IVendorLite;
  public user_type:number;
  myEvents: BehaviorSubject<List<IEvent>> = new BehaviorSubject(List([]));
  allEvents: BehaviorSubject<List<IEvent>> = new BehaviorSubject(List([]));
  private myEventIds: List<number>;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public auth: AuthService,
    public eventStore: EventStore,
    public navParams: NavParams,
  ) {
    if (this.navParams.get('vendor')) {
      this.vendor = this.navParams.get('vendor');
    }
    if(this.navParams.get('user_type')) {
      this.user_type = this.navParams.get('user_type');
    }
  }

  ionViewDidEnter() {
    this.loadData();
  }

  loadData(): Observable<any> {
    let obs1 = this.eventStore.getEventsByVendorId();
    obs1.subscribe(events => {
      this.myEvents.next(List(this.sortEvents(events)));
      if (events) {
        this.myEventIds = List(events.map(e => {return e.event_id}));
      } else {
        this.myEventIds = List([]);
      }
    });
    let obs2 = this.eventStore.getAllEvents()
    obs2.subscribe(events => {
      this.allEvents.next(List(this.sortEvents(events)));
    });
    return Rx.Observable.concat([obs1, obs2]);
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

  gotoEvent(event) {
    this.navCtrl.push(EventOverviewPage, {
      event: event,
        vendor: this.vendor,
        user_type: this.user_type
    });
  }

  private sortEvents (events:IEvent[]): IEvent[] {
    return _.orderBy(events, ['event_date_start', 'event_name'], ['asc', 'asc']);
  }

  getEventClass(eventId) {
    return this.myEventIds.contains(eventId) ? 'assigned' : '';
  }

  // goToProfilePage() {
  //     this.navCtrl.push(VendorProfilePage, {vendor:this.vendor});
  // }
  //
  // openEventList() {
  //     this.navCtrl.push(EventList)
  // }
  //
  // addTapped() {
  //     this.navCtrl.push(EventDetailsPage, {
  //         title: 'Edit Event Details'
  //     });
  // }
  //
  // editEvent(eventId) {
  //     this.eventStore.getEventByEventId(eventId).subscribe(event => {
  //         if (!event) { return console.log('could not find event. Please check logs') }
  //
  //         this.navCtrl.push(EventOverviewPage, {
  //             event: event
  //         });
  //     })
  // }
  //
  // getIconColor(event) {
  //     switch(event.status) {
  //         case 0:
  //             return 'primary';
  //         case 1:
  //             return 'secondary';
  //         default:
  //             return 'primary';
  //     }
  // }
  //
  // getIcon(event) {
  //     switch(event.status) {
  //         case 0:
  //             return 'alert';
  //         case 1:
  //             return 'checkmark-circle';
  //         default:
  //             return 'alert';
  //     }
  // }
  //
  // openMessage() {
  //     this.navCtrl.push(ReadMessage)
  // }
}