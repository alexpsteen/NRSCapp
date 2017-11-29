import {Component, ViewChild} from '@angular/core'

import {
  AlertController, ModalController, NavController, NavParams, ToastController,
  ViewController, Config, LoadingController
} from 'ionic-angular'
import { Camera, CameraOptions } from '@ionic-native/camera';

import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'
import { AuthService } from '../../app/auth.service'

import {UserStore} from "../../app/user.store";
import { HomePage } from "../home/home";
import {IUser, IVendor, IVendorLite, UserDao, UserType} from "../../app/user.interface";
import {LoginPage} from "../login/login";

const AWS = require('aws-sdk');

// declare let AWS: any;
declare const aws_user_files_s3_bucket;
declare const aws_user_files_s3_bucket_region;

@Component({
  selector: 'page-user-info',
  templateUrl: 'user-info.html'
})
export class UserInfoPage {
  addMode:boolean = false;

  user:IUser = {
    user_id: null,
    user_type: 1,
    first_name: null,
    last_name: null,
    cellphone_number: null,
    email: null,
    authentication_id: null
  };

  vendor:IVendorLite = {
    vendor_id: null,
    user_id: null,
    name: null,
    description: null,
    address: null,
    approved: 0
  };

  @ViewChild('avatar') avatarInput;

  private s3: any;
  public avatarPhoto: string;
  public selectedPhoto: Blob;
  public sub: string = null;

  constructor(
      public navCtrl: NavController,
      public viewCtrl: ViewController,
      public auth: AuthService,
      public modalCtrl: ModalController,
      public userStore: UserStore,
      public navParams: NavParams,
      public alertCtrl: AlertController,
      public toastCtrl: ToastController,
      public camera: Camera,
      public loadingCtrl: LoadingController) {
    if (this.navParams.get('user')) {
      this.user = this.navParams.get('user');
    }
    if (this.navParams.get('vendor')) {
      this.vendor = this.navParams.get('vendor');
    }
    this.addMode = this.user.user_id == null;
    this.avatarPhoto = null;
    this.selectedPhoto = null;
    this.s3 = new AWS.S3({
      'params': {
        'Bucket': aws_user_files_s3_bucket
      },
      'region': aws_user_files_s3_bucket_region
    });
    this.sub = AWS.config.credentials.identityId;
    this.refreshAvatar();
  }

  ionViewDidLoad() {
    if (this.addMode) {
      this.auth.getCredentials().subscribe(() => {
        this.auth.cognitoUser['getUserAttributes']((err, results) => {
          if (err) {
            return console.log('err getting attrs', err)
          }
          results.some(r => {
            if (r.getName() === 'email') {
              this.user.email = r.getValue();
              return true;
            }
            return false;
          });
        })
      });
    }
  }

  saveUser() {
    let userObj: UserDao = {user: this.user};
    if (userObj.user.user_type == UserType.VENDOR) {
      userObj.vendor = this.vendor;
    }
    if (this.addMode) {
      this.userStore.addUser(userObj).subscribe(rows => {
        if (rows) {
          this.navCtrl.setRoot(HomePage);
        } else {
          console.error('user creation error....');
        }
      }, err => {
        console.error('user creation error...', err);
      });
    } else {
      this.userStore.updateUser(userObj).subscribe(user => {
        this.dismiss();
      });
    }
  }

  signout () {
    this.auth.signout();
    this.navCtrl.setRoot(LoginPage);
  }

  dismiss() { this.viewCtrl.dismiss() }

  refreshAvatar() {
    this.s3.getSignedUrl('getObject', {'Key': 'protected/' + this.sub + '/avatar'}, (err, url) => {
      this.avatarPhoto = url;
    });
  }

  dataURItoBlob(dataURI) {
    // code adapted from: http://stackoverflow.com/questions/33486352/cant-upload-image-to-aws-s3-from-ionic-camera
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  };

  selectAvatar() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 200,
      targetWidth: 200,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.selectedPhoto  = this.dataURItoBlob('data:image/jpeg;base64,' + imageData);
      this.upload();
    }, (err) => {
      this.avatarInput.nativeElement.click();
      // Handle error
    });
  }

  uploadFromFile(event) {
    const files = event.target.files;
    console.log('Uploading', files)
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.selectedPhoto = this.dataURItoBlob(reader.result);
      this.upload();
    };
    reader.onerror = (error) => {
      alert('Unable to load file. Please try another.')
    }
  }

  upload() {
    let loading = this.loadingCtrl.create({
      content: 'Uploading image...'
    });
    loading.present();

    if (this.selectedPhoto) {
      this.s3.upload({
        'Key': 'protected/' + this.sub + '/avatar',
        'Body': this.selectedPhoto,
        'ContentType': 'image/jpeg'
      }).promise().then((data) => {
        this.refreshAvatar();
        console.log('upload complete:', data);
        loading.dismiss();
      }, err => {
        console.log('upload failed....', err);
        loading.dismiss();
      });
    } else {
      loading.dismiss();
    }
  }
}