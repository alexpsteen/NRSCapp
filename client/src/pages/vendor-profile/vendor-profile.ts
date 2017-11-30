import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {EditVendorProfilePage} from "../edit-vendor-profile/edit-vendor-profile";
import {IVendor, IVendorLite} from "../../app/user.interface";
import {UserStore} from "../../app/user.store";

/**
 * Generated class for the VendorProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

const AWS = require('aws-sdk');

// declare let AWS: any;
declare const aws_user_files_s3_bucket;
declare const aws_user_files_s3_bucket_region;

@IonicPage()
@Component({
  selector: 'page-vendor-profile',
  templateUrl: 'vendor-profile.html',
})
export class VendorProfilePage {

  public currentUser:any = {};
  public vendor:IVendor;
  private s3: any;
  public avatarPhoto: string;
  public selectedPhoto: Blob;
  public sub: string = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              public userStore: UserStore,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController) {
    if(this.navParams.get('vendor')) {
      this.vendor = this.navParams.get('vendor');
    }
    this.avatarPhoto = null;
    this.selectedPhoto = null;
    this.s3 = new AWS.S3({
      'params': {
        'Bucket': aws_user_files_s3_bucket
      },
      'region': aws_user_files_s3_bucket_region
    });
    this.sub = this.vendor.authentication_id;
    this.refreshAvatar();
  }

  ionViewDidLoad() {
    this.userStore.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      console.warn('found current user', user);
    }, err => {
      console.error('cannot find currentUser', err);
    });
  }
  refreshAvatar() {
    this.s3.getSignedUrl('getObject', {'Key': 'protected/' + this.sub + '/avatar'}, (err, url) => {
      this.avatarPhoto = url;
    });

  }

  updateVendorStatus(status) {
    if (status) {
      this.userStore.verifyVendor(this.vendor.vendor_id).subscribe(result => {
        if (result) {
          this.vendor.approved = status;
          this.doToast('Vendor approved!');
        }
      });
    } else {
      this.userStore.deactivateVendor(this.vendor.vendor_id).subscribe(result => {
        if (result) {
          this.vendor.approved = status;
          this.doToast('Vendor deactivated');
        }
      });
    }

  }

  confirmDelete() {
    const alert = this.alertCtrl.create({
      title: 'Delete?',
      message: 'Delete this vendor?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.userStore.deleteVendor(this.vendor.user_id).subscribe(event => {
              if (event) {
                this.navCtrl.pop();
                this.doToast('Vendor deleted successfully');
              } else {
                console.log('Could not delete vendor. Please see logs');
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
