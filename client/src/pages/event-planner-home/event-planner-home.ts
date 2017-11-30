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
import {Observable} from "rxjs/Observable";

/**
 * Generated class for the EventPlannerHomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
let Rx = require('rxjs/Rx');

@IonicPage()
@Component({
  selector: 'page-event-planner-home',
  templateUrl: 'event-planner-home.html',
})
export class EventPlannerHomePage {

  tabs:string = 'myEvents';
  user_type:number;

  myEvents: BehaviorSubject<List<IEvent>> = new BehaviorSubject(List([]));
  allEvents: BehaviorSubject<List<IEvent>> = new BehaviorSubject(List([]));
  vendors: BehaviorSubject<List<IVendor>> = new BehaviorSubject(List([]));

  constructor(public modalCtrl: ModalController,
              public auth: AuthService,
              public navCtrl: NavController,
              public navParams: NavParams,
              public eventStore: EventStore,
              public userStore: UserStore) {
      if(this.navParams.get('user_type')>= 0) {
          this.user_type = this.navParams.get('user_type');
      }
    console.log("EVENT HOME USER TYPE:", this.user_type);
  }

  ionViewDidEnter() {
    this.loadData();
  }

  loadData(): Observable<any> {
    let observables: Observable<any>[] = [];
    let obs1 = this.eventStore.getEventsByEventPlannerId();
    obs1.subscribe(events => {
      this.myEvents.next(List(this.sortEvents(events)));
    });
    observables.push(obs1);
    let obs2 = this.eventStore.getAllEvents();
    obs2.subscribe(events => {
      this.allEvents.next(List(this.sortEvents(events)));
    });
    observables.push(obs2);
    let obs3 = this.userStore.getVendors();
    obs3.subscribe(vendors => {
      this.vendors.next(List(this.sortVendors(vendors)));
    });
    observables.push(obs3);
    return Rx.Observable.concat(observables);
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
        user_type:this.user_type
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

  getEventClass(plannerId) {
    return plannerId ? '' : 'unassigned';
  }
}
