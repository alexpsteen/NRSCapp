import { Component } from '@angular/core'
import {AlertController, NavController, NavParams, ToastController, ViewController} from 'ionic-angular'
import { AuthService } from '../../../app/auth.service'
import UUID from 'uuid'
import {IFeature} from "../../../app/feature.interface";
import {FeatureStore} from "../../../app/feature.store";

@Component({
  selector: 'page-food-details',
  templateUrl: 'food.html'
})
export class FoodDetailsPage {
  feature:IFeature = {
    featureId: null,
    eventId: null,
    type: null,
    status: 0
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
      this.feature.type = this.navParams.get('type');
    }
    if (this.navParams.get('eventId')) {
      this.feature.eventId = this.navParams.get('eventId');
    }
  }

  get title():string { return this.feature.featureId ? 'Edit Feature' : 'Create Feature' }

  saveFeature () {
    if (this.feature.featureId) {
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
      this.feature.featureId = UUID.v4();
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
            this.featureStore.deleteFeature(this.feature.featureId).subscribe(feature => {
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
