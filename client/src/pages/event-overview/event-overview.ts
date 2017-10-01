import { Component } from '@angular/core'

import {ModalController, NavController, NavParams} from 'ionic-angular'

import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'
import { AuthService } from '../../app/auth.service'

import UUID from 'uuid'

import {EventStore} from "../../app/event.store";
import {IEvent} from "../../app/event.interface";
import {EventDetailsPage} from "../event-details/event-details";
import {FeatureDetailsPage} from "../feature-details/feature-details";
import {FeatureSelectionPage} from "../feature-selection/feature-selection";
import {FeatureStore} from "../../app/feature.store";

@Component({
  selector: 'page-event-overview',
  templateUrl: 'event-overview.html'
})
export class EventOverviewPage {
  public event:IEvent;
  public featureStatus:string = 'all';

  constructor(
    public navCtrl: NavController,
    public auth: AuthService,
    public modalCtrl: ModalController,
    public eventStore: EventStore,
    public featureStore: FeatureStore,
    public navParams: NavParams) {
    if (this.navParams.get('event')) {
      this.event = this.navParams.get('event');
    }
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

  getFeaturesTest() {
    return [{type: 1},{type: 4},{type: 0},{type: 2},{type:1},{type:0},{type:1},{type:3},{type:3}];
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
      eventId: this.event.eventId
    });
  }

  editFeature(feature) {
    this.navCtrl.push(FeatureDetailsPage, {
      feature: feature
    });
  }

  plan() {
    // TODO open a confirmation modal and then update event status
  }

  openLoginModal () {
    let modal = this.modalCtrl.create(this.auth.isUserSignedIn() ? LogoutModal : LoginModal);
    modal.present()
  }

  get userColor ():string {
    return this.auth.isUserSignedIn() ? 'secondary' : 'primary'
  }
}
