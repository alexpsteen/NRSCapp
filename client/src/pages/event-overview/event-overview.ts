import { Component } from '@angular/core'

import {AlertController, ModalController, NavController, NavParams, ToastController} from 'ionic-angular'

import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'
import { AuthService } from '../../app/auth.service'

import UUID from 'uuid'

import {EventStore} from "../../app/event.store";
import {EventStatus, IEvent} from "../../app/event.interface";
import {EventDetailsPage} from "../event-details/event-details";
import {FeatureDetailsPage} from "../feature-details/feature-details";
import {FeatureSelectionPage} from "../feature-selection/feature-selection";
import {FeatureStore} from "../../app/feature.store";
import {UserStore} from "../../app/user.store";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {List} from "immutable";
import {IUser} from "../../app/user.interface";
import {VenueDetailsPage} from "../feature-details/venue/venue";
import {FoodDetailsPage} from "../feature-details/food/food";
import {MusicDetailsPage} from "../feature-details/music/music";
import {ClothingDetailsPage} from "../feature-details/clothing/clothing";
import {IFeature} from "../../app/feature.interface";
import {Observable} from "rxjs/Observable";

let Rx = require('rxjs/Rx');

@Component({
  selector: 'page-event-overview',
  templateUrl: 'event-overview.html'
})
export class EventOverviewPage {
  public event:IEvent;
  public user_type:number;
  public featureStatus:string = 'all';
  public planner = 'NONE';
  public selectedFeature:any;
  public vendor:any;
  public usedBudget:number = 0;

  planners: BehaviorSubject<List<IUser>> = new BehaviorSubject(List([]));
  myFeaturesAll: BehaviorSubject<List<IFeature>> = new BehaviorSubject(List([]));
  myFeaturesConfirmed: BehaviorSubject<List<IFeature>> = new BehaviorSubject(List([]));
  myFeaturesUnconfirmed: BehaviorSubject<List<IFeature>> = new BehaviorSubject(List([]));
  isAdmin: boolean = false;
  isVendor: boolean = false;

  constructor(
    public navCtrl: NavController,
    public auth: AuthService,
    public modalCtrl: ModalController,
    public eventStore: EventStore,
    public userStore: UserStore,
    public featureStore: FeatureStore,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {
    if (this.navParams.get('event')) {
      this.event = this.navParams.get('event');
    }
    if(this.navParams.get('user_type') >= 0) {
      this.user_type = this.navParams.get('user_type');
    }
    console.log("EVENT-OVERVIEW USER TYPE:", this.user_type);
    if(this.navParams.get('vendor')) {
      this.vendor = this.navParams.get('vendor');
    }
  }

  ionViewDidEnter() {
    this.loadData();
  }

  loadData(): Observable<any> {
    this.usedBudget = 0;
    let observables: Observable<any>[] = [];
    if (this.event.event_status == EventStatus.PUBLISHED) {
      let obs1 = this.userStore.getUserById(this.event.event_planner_id);
      obs1.subscribe(user => {
        if (user) {
          this.planner = `${user.first_name} ${user.last_name}`;
        }
      });
      observables.push(obs1);
    }
    let obs2 = this.userStore.getCurrentUser();
    obs2.subscribe(user => {
      this.isAdmin = user.user_type === 0;
      this.isVendor = user.user_type === 2;
    });
    observables.push(obs2);
    let obs3 = this.userStore.getPlanners();
    obs3.subscribe(planners => {
      this.planners.next(List(planners));
    });
    observables.push(obs3);
    const that = this;
    let obs4 = this.featureStore.getFeatures(this.event.event_id);
    obs4.subscribe(features => {
      const unconfirmed = features.filter(f => {return f.status == 0});
      const confirmed = features.filter(f => {return f.status == 1});
      this.myFeaturesAll.next(List(features));
      this.myFeaturesConfirmed.next(List(confirmed));
      this.myFeaturesUnconfirmed.next(List(unconfirmed));
      const featureIds = features.filter(f => {return f.status == 1}).map(f => {
        return f.feature_id;
      });
      let obs5 = this.featureStore.getRecommendations(featureIds);
      obs5.subscribe(recs => {
        console.warn(that.usedBudget, recs);
        if (recs) {
          recs.forEach(r => {
            that.usedBudget += r.amount;
          })
        }
      });
      observables.push(obs5);
    });
    observables.push(obs4);
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

  editEvent() {
    // this.eventStore.getEventById(this.event.eventId).subscribe(event => {
    //   if (!event) { return console.log('could not find event. Please check logs') }

      this.navCtrl.push(EventDetailsPage, {
        event: this.event,
        parentPage: this,
        title: 'Edit Event Details'
      });
    // })
  }

  getFeatures(status:string) {
    // this.featureStore.features.subscribe(features => {
    //   // return features.filter((f) => {return f.status == status});
    //   return features;
    // })
    this.featureStore.features;
  }

  addFeature() {
    this.navCtrl.push(FeatureSelectionPage, {
      eventId: this.event.event_id
    });
  }

  seeFeature(feature) {
    console.log("SEE FEATURE");
    this.featureStore.getFeature(feature.feature_id, feature.feature_type).subscribe( returnedFeature => {
      this.selectedFeature = returnedFeature;
        console.log("FEATURE STORED");
        this.navCtrl.push(FeatureDetailsPage, {
            feature: this.selectedFeature,
            user_type: this.user_type,
            event: this.event,
            vendor: this.vendor,
        });
    });

  }

  plan() {
    const alert = this.alertCtrl.create({
      title: "Let's Plan",
      message: 'Click Publish to let our event planners begin helping you select services. You can still make changes after you publish.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Publish',
          handler: () => {
            this.event.event_status = 1;
            this.eventStore.publishEvent(this.event.event_id).subscribe(event => {
              if (event) {
                this.navCtrl.pop();
                this.toastCtrl.create({
                  message: 'Event succesfully published to the event planners. One will be assigned to you shortly.',
                  position: 'top',
                  duration: 3000
                }).present();
              } else {
                console.log('Could not update event. Please see logs');
              }
            });
          }
        }
      ]
    });

    alert.present();
  }

  getName(user) {
    return `${user.first_name} ${user.last_name}`;
  }

  assignPlanner(plannerId) {
    this.eventStore.assignEventPlanner(this.event.event_id, plannerId).subscribe();
  }

  getBudgetWidth() {
    return "{'width': 'calc(100% * '" + this.usedBudget + "' / '" + this.event.event_budget + "')'}";
  }
}
