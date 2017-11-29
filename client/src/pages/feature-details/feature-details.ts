import { Component } from '@angular/core'
import {AlertController, NavController, NavParams, ToastController, ViewController} from 'ionic-angular'
import { AuthService } from '../../app/auth.service'
import UUID from 'uuid'
import {IFeature} from "../../app/feature.interface";
import {FeatureStore} from "../../app/feature.store";

@Component({
  selector: 'page-feature-details',
  templateUrl: 'feature-details.html'
})
export class FeatureDetailsPage {
  public feature: IFeature;
  public featureString: String;
  public field1: String;
  public field2: String;
  public field1Descript: String;
  public field2Descript: String;

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
      switch (this.feature.feature_type) {
          case 0:
            //food
              this.featureString = "Food";
              this.field1 = "Food Category";
              this.field1Descript = this.navParams.get('feature').category;
              console.log(this.navParams.get('feature').category);
              this.field2 = "Wait Staff";
              this.field2Descript = this.navParams.get('feature').wait_staff;
            break;
          case 1:
              //venue
              this.featureString = "Venue";
              this.field1 = "Type of Location";
              this.field1Descript = this.navParams.get('feature').type_of_location;
              this.field2 = "Number of People";
              this.field2Descript = this.navParams.get('feature').num_of_people;
              break;
          case 2:
              //music
              this.featureString = "Music";
              this.field1 = "Genre";
              this.field1Descript = this.navParams.get('feature').genre;
              this.field2 = "Live Music";
              this.field2Descript = this.navParams.get('feature').live_music;
              break;
          case 3:
              //clothing
              this.featureString = "Clothing";
              this.field1 = "Gender";
              this.field1Descript = this.navParams.get('feature').gender;
              this.field2 = "Color";
              this.field2Descript = this.navParams.get('feature').color;
              break;
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
      this.feature.feature_id = UUID.v4();
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
