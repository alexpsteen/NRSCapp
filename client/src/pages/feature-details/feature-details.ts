import { Component } from '@angular/core'
import {AlertController, NavController, NavParams, ToastController, ViewController} from 'ionic-angular'
import { AuthService } from '../../app/auth.service'
import UUID from 'uuid'
import {IFeature} from "../../app/feature.interface";
import {FeatureStore} from "../../app/feature.store";
import {VendorProfilePage} from "../vendor-profile/vendor-profile";

@Component({
  selector: 'page-feature-details',
  templateUrl: 'feature-details.html'
})
export class FeatureDetailsPage {
  public feature: any;
  public user_type:number;
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
      if(this.navParams.get('user_type')) {
          this.user_type = this.navParams.get('user_type');
      }
      console.log(this.feature);
      switch (this.feature.feature_type) {
          case 0:
            //food
              this.featureString = "Food";
              this.field1 = "Food Category";
              switch(this.feature.category) {
                  case 0:
                      this.field1Descript = "Asian";
                      break;
                  case 1:
                      this.field1Descript = "Hispanic";
                      break;
                  case 2:
                      this.field1Descript = "American";
                      break;
                  case 3:
                      this.field1Descript = "Italian";
                      break;
              }
              this.field2 = "Wait Staff";
              switch(this.feature.wait_staff){
                  case 0:
                      this.field2Descript = "None";
                      break;
                  case 1:
                      this.field2Descript = "0-20";
                      break;
                  case 2:
                      this.field2Descript = "20-50";
                      break;
              }
            break;
          case 1:
              //venue
              this.featureString = "Venue";
              this.field1 = "Type of Location";
              this.field1Descript = this.feature.type_of_location;
              this.field2 = "Number of People";
              this.field2Descript = this.feature.num_of_people;
              break;
          case 2:
              //music
              this.featureString = "Music";
              this.field1 = "Genre";
              this.field1Descript = this.feature.genre;
              this.field2 = "Live Music";
              this.field2Descript = this.feature.live_music;
              break;
          case 3:
              //clothing
              this.featureString = "Clothing";
              this.field1 = "Gender";
              this.field1Descript = this.feature.gender;
              this.field2 = "Color";
              this.field2Descript = this.feature.color;
              break;
      }
    }


  get title():string { return this.feature.feature_id ? 'Edit Feature' : 'Create Feature' }




  showRecommended(feature_id) {
      this.featureStore.getRecommendedVendor(feature_id).subscribe(vendor => {
          this.navCtrl.push(VendorProfilePage, {vendor: vendor});
      })
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
