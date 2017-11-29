import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {EditVendorProfilePage} from "../edit-vendor-profile/edit-vendor-profile";
import {IVendorLite} from "../../app/user.interface";

/**
 * Generated class for the VendorProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vendor-profile',
  templateUrl: 'vendor-profile.html',
})
export class VendorProfilePage {

  public vendor:IVendorLite;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if(this.navParams.get('vendor')) {
      this.vendor = this.navParams.get('vendor');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorProfilePage');
  }

  editProfile() {
    this.navCtrl.push(EditVendorProfilePage);
  }

}
