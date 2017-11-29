import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {AuthService} from "../../app/auth.service";
import {EventStore} from "../../app/event.store";
import {IEvent} from "../../app/event.interface";
import {List} from "immutable";
import {IVendor} from "../../app/user.interface";
import {UserStore} from "../../app/user.store";
import _ from 'lodash';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {EventOverviewPage} from "../event-overview/event-overview";
import {VendorProfilePage} from "../vendor-profile/vendor-profile";

/**
 * Generated class for the EventPlannerHomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-planner-home',
  templateUrl: 'event-planner-home.html',
})
export class EventPlannerHomePage {

  tabs:string = 'myEvents';

  myEvents: BehaviorSubject<List<IEvent>> = new BehaviorSubject(List([]));
  allEvents: BehaviorSubject<List<IEvent>> = new BehaviorSubject(List([]));
  vendors: BehaviorSubject<List<IVendor>> = new BehaviorSubject(List([]));

  constructor(public modalCtrl: ModalController,
              public auth: AuthService,
              public navCtrl: NavController,
              public navParams: NavParams,
              public eventStore: EventStore,
              public userStore: UserStore) {
  }

  ionViewDidLoad() {
    this.eventStore.getEventsByEventPlannerId().subscribe(events => {
      this.myEvents.next(List(this.sortEvents(events)));
    });
    this.eventStore.getAllEvents().subscribe(events => {
      this.allEvents.next(List(this.sortEvents(events)));
    });
    this.userStore.getVendors().subscribe(vendors => {
      this.vendors.next(List(this.sortVendors(vendors)));
    });
  }

  gotoEvent(event) {
    this.navCtrl.push(EventOverviewPage, {
      event: event
    });
  }

  gotoVendor(vendor) {
    this.navCtrl.push(VendorProfilePage, {
      vendor: vendor
    });
  }

  private sortEvents (events:IEvent[]): IEvent[] {
    return _.orderBy(events, ['event_date_start', 'event_name'], ['asc', 'asc']);
  }

  private sortVendors (vendors:IVendor[]): IVendor[] {
    return _.orderBy(vendors, ['name'], ['asc']);
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
}
