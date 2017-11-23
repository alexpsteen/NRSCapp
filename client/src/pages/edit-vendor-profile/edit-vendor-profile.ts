import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EditVendorProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-vendor-profile',
  templateUrl: 'edit-vendor-profile.html',
})
export class EditVendorProfilePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditVendorProfilePage');
  }

  submitChanges(){
    console.log("Changes submitted");
    this.navCtrl.pop();
  }

}
