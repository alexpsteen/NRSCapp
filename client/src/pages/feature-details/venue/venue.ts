import { Component } from '@angular/core'
import {AlertController, NavController, NavParams, ToastController, ViewController} from 'ionic-angular'
import { AuthService } from '../../../app/auth.service'
import UUID from 'uuid'
import {IFeature, IFeatureVenue} from "../../../app/feature.interface";
import {FeatureStore} from "../../../app/feature.store";

@Component({
  selector: 'page-venue-details',
  templateUrl: 'venue.html'
})
export class VenueDetailsPage {
    feature: IFeatureVenue ={
    feature_id:null,
    event_id:null,
    feature_type:null,
    status:0,
    additional_requests:null,
    venue_id:null,
    num_of_people:null,
    type_of_location:null
};

  constructor(
    public navCtrl: NavController,
    public auth: AuthService,
    public featureStore: FeatureStore,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController) {
    if (this.navParams.get('feature')) {
      this.feature = this.navParams.get('feature');
    }
    if (this.navParams.get('type')) {
      this.feature.feature_type = this.navParams.get('type');
    }
    if (this.navParams.get('eventId')) {
      this.feature.event_id = this.navParams.get('eventId');
    }
  }

  get title():string { return this.feature.feature_id ? 'Edit Feature' : 'Create Feature' }

  saveFeature () {
    if (this.feature.feature_id) {
      this.featureStore.updateFeature(this.feature).subscribe(feature => {
        if (feature) {
          this.navCtrl.pop();
          this.doToast('Feature updated successfully');
        } else {
          console.log('Could not update feature. Please see logs');
        }
      });
    } else {
      console.log('creating feature', this.feature);
      this.featureStore.addFeature(this.feature).subscribe(feature => {
        if (feature) {
          this.navCtrl.pop();
          this.doToast('Feature created successfully');
        } else {
          console.log('Could not add feature. Please see logs');
        }
      });
    }
  }

  confirmDelete() {
    const alert = this.alertCtrl.create({
      title: 'Delete?',
      message: 'Remove this feature from the event?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.featureStore.deleteFeature(this.feature.feature_id).subscribe(feature => {
              if (feature) {
                this.navCtrl.pop();
                this.doToast('Feature deleted successfully');
              } else {
                console.log('Could not delete feature. Please see logs');
              }
            });
          }
        }
      ]
    });

    alert.present();
  }

  doToast(text:string) {
    this.toastCtrl.create({
      message: text,
      position: 'top',
      duration: 3000
    }).present();
  }
}
