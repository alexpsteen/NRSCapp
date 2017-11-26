import { Component } from '@angular/core'

import {AlertController, ModalController, NavController, NavParams, ToastController} from 'ionic-angular'

import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'
import { AuthService } from '../../app/auth.service'

import {UserStore} from "../../app/user.store";
import { HomePage } from "../home/home";
import {IUser, IVendor, IVendorLite, UserDao, UserType} from "../../app/user.interface";

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

  constructor(
      public navCtrl: NavController,
      public auth: AuthService,
      public modalCtrl: ModalController,
      public userStore: UserStore,
      public navParams: NavParams,
      public alertCtrl: AlertController,
      public toastCtrl: ToastController) {
    if (this.navParams.get('user')) {
      this.user = this.navParams.get('user');
    }
    if (this.navParams.get('vendor')) {
      this.vendor = this.navParams.get('vendor');
    }
    this.addMode = this.user.user_id == null;
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
        this.navCtrl.setRoot(HomePage, {
          user: user
        });
      });
    }
  }
}