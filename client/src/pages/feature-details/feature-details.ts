import { Component } from '@angular/core'
import {AlertController, NavController, NavParams, ToastController, ViewController} from 'ionic-angular'
import { AuthService } from '../../app/auth.service'
import UUID from 'uuid'
import {IFeature} from "../../app/feature.interface";
import {FeatureStore} from "../../app/feature.store";
import {EventStore} from "../../app/event.store";
import {VendorProfilePage} from "../vendor-profile/vendor-profile";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {List} from "immutable";
import {IEvent} from "../../app/event.interface";
import {MakeBidPage} from "../make-bid/make-bid";

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
  public event:IEvent;
  public vendor: any;

    biddingVendors: BehaviorSubject<List<any>> = new BehaviorSubject(List([]));

  constructor(
    public navCtrl: NavController,
    public auth: AuthService,
    public featureStore: FeatureStore,
    public eventStore: EventStore,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController) {
      if (this.navParams.get('feature')) {
          this.feature = this.navParams.get('feature');
      }
      if(this.navParams.get('user_type') >= 0) {
          this.user_type = this.navParams.get('user_type');
      }
      console.log("FEATURE DETAILS USER TYPE", this.user_type);
      if(this.navParams.get('event')) {
          this.event = this.navParams.get('event');
      }
      if(this.navParams.get('vendor')) {
          this.vendor = this.navParams.get('vendor');
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
              switch(this.feature.type_of_location) {
                  case 0:
                      this.field1Descript = "Church";
                      break
                  case 1:
                      this.field1Descript = "Theater";
                      break;
                  case 2:
                      this.field1Descript = "Farm";
                      break;
                  case 3:
                      this.field1Descript = "Beach";
                      break;
                  case 4:
                      this.field1Descript = "Other";
                      break;
              }

              this.field2 = "Number of People";
              switch(this.feature.num_of_people) {
                  case 0:
                      this.field2Descript = "1-10";
                      break;
                  case 1:
                      this.field2Descript = "11-25";
                      break;
                  case 2:
                      this.field2Descript = "25-49";
                      break;
                  case 3:
                      this.field2Descript = "50+";
                      break;
              }
              break;
          case 2:
              //music
              this.featureString = "Music";
              this.field1 = "Genre";
              switch(this.feature.genre) {
                  case 0:
                      this.field1Descript = "Rock and Roll";
                      break;
                  case 1:
                      this.field1Descript = "Pop";
                      break;
                  case 2:
                      this.field1Descript = "Rap";
                      break;
                  case 3:
                      this.field1Descript = "Other";
                      break;
              }
              this.field2 = "Live Music";
              switch(this.feature.live_music){
                  case 0:
                      this.field2Descript = "Band";
                      break;
                  case 1:
                      this.field2Descript = "DJ";
                      break;
              }
              break;
          case 3:
              //clothing
              this.featureString = "Clothing";
              this.field1 = "Gender";
              switch(this.feature.gender) {
                  case 0:
                      this.field1Descript = "Female";
                      break;
                  case 1:
                      this.field1Descript = "Male";
                      break;
              }
              this.field2 = "Color";
              switch(this.feature.color){
                  case 0:
                      this.field2Descript = "Red";
                      break;
                  case 1:
                      this.field2Descript = "Blue";
                      break;
                  case 2:
                      this.field2Descript = "Green";
                      break;
                  case 3:
                      this.field2Descript = "Yellow";
                      break;
                  case 4:
                      this.field2Descript = "Orange";
                      break;
                  case 5:
                      this.field2Descript = "Black";
                      break;
              }
              break;
      }
    }

    ionViewDidLoad() {
      this.featureStore.getBiddingVendors(this.feature.feature_id).subscribe(vendors => {
          this.biddingVendors.next(List(vendors));
      });
    }


  get title():string { return this.feature.feature_id ? 'Edit Feature' : 'Create Feature' }


    goToBidPage() {
      this.navCtrl.push(MakeBidPage, {
          feature: this.feature,
          vendor: this.vendor

      });
    }

  showRecommended(feature_id) {
      this.featureStore.getRecommendedVendor(feature_id).subscribe(vendor => {
          this.navCtrl.push(VendorProfilePage, {vendor: vendor, user_type: this.user_type, feature: this.feature, event: this.event});
      })
  }

  seeVendor(vendor) {
      this.featureStore.getVendorDetails(vendor.vendor_id, this.feature.feature_id).subscribe(vendor => {
          this.navCtrl.push(VendorProfilePage, {
              vendor:vendor,
              user_type : this.user_type,
              feature: this.feature,
              event: this.event
          });
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
            this.featureStore.deleteFeature(this.feature.feature_id, this.feature.feature_type).subscribe(feature => {
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
