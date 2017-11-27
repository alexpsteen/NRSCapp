import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {LogoutModal} from "../../modal/logout/logout";
import {LoginModal} from "../../modal/login/login";
import {AuthService} from "../../app/auth.service";

/**
 * Generated class for the EventPlannerHomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-planner-home',
  templateUrl: 'event-planner-home.html',
})
export class EventPlannerHomePage {

  constructor(public modalCtrl: ModalController,
              public auth: AuthService,
              public navCtrl: NavController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPlannerHomePage');
  }
}
