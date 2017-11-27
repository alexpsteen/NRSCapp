import { Component } from '@angular/core';

import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'

import {NavController, NavParams, ViewController, ModalController, AlertController} from 'ionic-angular'
import { AuthService } from '../../app/auth.service'
import {EventStore} from '../../app/event.store'

@Component({
    selector: 'event-list',
    templateUrl: 'event-list.html'
})
export class EventList {
    constructor(public navCtrl: NavController, private viewCtrl: ViewController, public NavParams: NavParams,
                public modalCtrl: ModalController, public eventStore: EventStore, public auth: AuthService,
                private alertCtrl: AlertController
    ) { }

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

    sendRequest() {
        let alert = this.alertCtrl.create({
            title: 'Confirm Request',
            message: 'Would you like to send a request to the event planners to service this event?',
            buttons: [
                {
                    text: "Cancel",
                    role: 'cancel',
                    handler: () => {
                        console.log("Request cancelled.")
                    }
                },
                {
                  text: "Send Request",
                  handler: () => {
                      console.log("Request sent.")
                  }
                }
            ]
        });
        alert.present();
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
}
