import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FeatureStore} from "../../app/feature.store";
import {IBid} from "../../app/feature.interface";

/**
 * Generated class for the MakeBidPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-make-bid',
  templateUrl: 'make-bid.html',
})
export class MakeBidPage {

  bid: IBid = {
    feature_id:null,
    vendor_id:null,
    interested_id:null,
    bid:null,
    amount:null
  };
  public feature:any;
  public vendor:any;

  constructor(public navCtrl: NavController, public featureStore: FeatureStore, public navParams: NavParams) {
    if(this.navParams.get('feature')) {
      this.feature = this.navParams.get('feature');
    }
    console.log('FEATURE:', this.feature);
    if(this.navParams.get('vendor')) {
      this.vendor = this.navParams.get('vendor');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MakeBidPage');
  }

  addNewBid() {
    this.bid.feature_id = this.feature.feature_id;
    this.bid.vendor_id = this.vendor.vendor_id;
    this.featureStore.addBid(this.bid).subscribe(newBid => {
      if(newBid) {
        this.navCtrl.pop();
        this.navCtrl.pop();
      }
    })
  }

}
