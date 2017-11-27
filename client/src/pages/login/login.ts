import { Component } from '@angular/core'
import { NavController, NavParams, ViewController } from 'ionic-angular'
import { AuthService } from '../../app/auth.service'
import { UserStore } from "../../app/user.store";
import { HomePage } from "../home/home";
import {IUser, UserType} from "../../app/user.interface";
import {UserInfoPage} from "../user-info/user-info";
import {VendorHomePage} from "../vendor-home/vendor-home";
import {EventPlannerHomePage} from "../event-planner-home/event-planner-home";

@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage {

  page: string = 'login';
  credentials: Credentials = {};
  user: IUser = {
    user_id: null,
    user_type: UserType.CUSTOMER,
    email: null
  };
  message: string;
  error: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public userStore: UserStore,
              public auth: AuthService) {}

  ionViewDidLoad() { }

  signin () {
    this.auth.signin(this.credentials).then((user) => {
      console.log('signed in');

      this.userStore.getCurrentUser().subscribe(user => {
        if (user) {
          console.log(`user found: ${user}`);
          switch (user.user_type) {
            case UserType.PLANNER:
              this.navCtrl.setRoot(EventPlannerHomePage, {
                user: user
              });
              break;
            case UserType.CUSTOMER:
              this.navCtrl.setRoot(HomePage, {
                user: user
              });
              break;
            case UserType.VENDOR:
              this.navCtrl.setRoot(VendorHomePage, {
                user: user
              });
              break;
          }

        } else {
          console.log('Need to fill in user info');
          this.navCtrl.setRoot(UserInfoPage);
        }
      });
    }).catch((err) => {
      console.log('error signing in', err);
      this.setError(err.message);
    })
  }

  register () {
    this.auth.register(this.credentials).then((loginUser) => {
      console.log('register: success', loginUser);
      this.page = 'confirm';
    }).catch((err) => {
      console.log('error registering', err);
      this.setError(err.message);
    })
  }

  confirm () {
    this.auth.confirm(this.credentials).then((user) => {
      this.page = 'login';
      this.setMessage('You have been confirmed. Please sign in.')
    }).catch((err) => {
      console.log('error confirming', err);
      this.setError(err.message);
    })
  }

  private setMessage(msg) {
     this.message = msg;
     this.error = null;
  }

  private setError(msg) {
     this.error = msg;
     this.message = null;
  }

  // dismiss () { this.viewCtrl.dismiss() }

  reset () { this.error = null; this.message = null; }

  showConfirmation () { this.page = 'confirm' }
}

interface Credentials {
  username?: string
  email?: string
  password?: string
  confcode?: string
}
