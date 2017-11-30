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

  planners: BehaviorSubject<List<IUser>> = new BehaviorSubject(List([]));
  myFeatures: BehaviorSubject<List<IFeature>> = new BehaviorSubject(List([]));
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
    if(this.navParams.get('user_type')) {
      this.user_type = this.navParams.get('user_type');
    }
  }

  ionViewDidLoad() {
    if (this.event.event_status == EventStatus.PUBLISHED) {
      this.userStore.getUserById(this.event.event_planner_id).subscribe(user => {
        if (user) {
          this.planner = `${user.first_name} ${user.last_name}`;
        }
      });
    }
    this.userStore.getCurrentUser().subscribe(user => {
      this.isAdmin = user.user_type === 0;
      this.isVendor = user.user_type === 2;
    });
    this.userStore.getPlanners().subscribe(planners => {
      this.planners.next(List(planners));
    });
    this.featureStore.getFeatures(this.event.event_id).subscribe(features => {
      this.myFeatures.next(List(features));
    })
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
            user_type: this.user_type
        });
    });
    //   this.navCtrl.push(FeatureDetailsPage, {
    //     feature:feature,
    //       user_type: this.user_type
    //   })
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
}
