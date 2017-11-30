import { Component } from '@angular/core'

import {AlertController, NavController, NavParams, ToastController, ViewController, ModalController} from 'ionic-angular'

import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'
import { AuthService } from '../../app/auth.service'
import {EventStore} from '../../app/event.store'
import {ComposeMessagePage} from "../compose-message/compose-message";

@Component({
    selector:"read-message",
    templateUrl:"read-message.html"
})

export class ReadMessage {
    constructor(public navCtrl: NavController, private viewCtrl: ViewController, public auth: AuthService,
                public eventStore: EventStore, public modalCtrl: ModalController) {}

    doRefresh (refresher?) {
        let subscription = this.eventStore.refresh().subscribe({
            complete: () => {
                subscription.unsubscribe();
                if (refresher) {
                    refresher.complete();
                }
            }
        })
    }

    getIconColor(event) {
        switch(event.status) {
            case 0:
                return 'primary';
            case 1:
                return 'secondary';
            default:
                return 'primary';
        }
    }

    getIcon(event) {
        switch(event.status) {
            case 0:
                return 'alert';
            case 1:
                return 'checkmark-circle';
            default:
                return 'alert';
        }
    }

    load() {
        //document.getElementById("message").innerHTML = "Message";
        this.navCtrl.setRoot(ComposeMessagePage)
    }

    message = {
        sender: "",
        subject: "",
        body: ""
    }
}