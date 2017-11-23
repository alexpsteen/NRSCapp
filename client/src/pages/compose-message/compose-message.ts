import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AlertController} from "ionic-angular";

/**
 * Generated class for the ComposeMessagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-compose-message',
  templateUrl: 'compose-message.html',
})
export class ComposeMessagePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComposeMessagePage');
  }

  finalizeSubmit() {
    const done = this.alertCtrl.create({
        title: "MESSAGE SENT",
    });
    this.navCtrl.pop();
    done.present();
  }
  submit() {
      var mess = document.getElementById( "message");
      
      const alert = this.alertCtrl.create({
          title: "Confirmation",
          message: 'Do you really want to send the message?',
          buttons: ['NO',{text: 'YES', handler: () =>{
            this.finalizeSubmit();
          }
          }
          ]
      });
      alert.present();
  }

}
