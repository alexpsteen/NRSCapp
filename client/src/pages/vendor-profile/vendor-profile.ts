import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {EditVendorProfilePage} from "../edit-vendor-profile/edit-vendor-profile";
import {IVendor, IVendorLite} from "../../app/user.interface";

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

  public vendor:IVendor;
  private s3: any;
  public avatarPhoto: string;
  public selectedPhoto: Blob;
  public sub: string = null;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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

  refreshAvatar() {
    this.s3.getSignedUrl('getObject', {'Key': 'protected/' + this.sub + '/avatar'}, (err, url) => {
      this.avatarPhoto = url;
    });
  }

}
