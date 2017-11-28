import { Component } from '@angular/core'

import {NavController, NavParams} from 'ionic-angular'
import { ModalController } from 'ionic-angular'

import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'
import { AuthService } from '../../app/auth.service'

import {EventDetailsPage} from "../event-details/event-details";
import {EventStore} from "../../app/event.store";
import {EventOverviewPage} from "../event-overview/event-overview"
import {EventList} from "../event-list/event-list"
import {ReadMessage} from "../read-message/read-message"
import {VendorProfilePage} from "../vendor-profile/vendor-profile";
import {IVendorLite} from "../../app/user.interface";

@Component({
    selector: 'page-vendor-home',
    templateUrl: 'vendor-home.html'
})
export class VendorHomePage {

    public vendor:IVendorLite;

    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public auth: AuthService,
        public eventStore: EventStore,
        public navParams: NavParams,
        ) {
        if (this.navParams.get('vendor')) {
            this.vendor = this.navParams.get('vendor');
        }
    }

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

    goToProfilePage() {
        this.navCtrl.push(VendorProfilePage, {vendor:this.vendor});
    }

    openEventList() {
        this.navCtrl.push(EventList)
    }

    addTapped() {
        this.navCtrl.push(EventDetailsPage, {
            title: 'Edit Event Details'
        });
    }

    editEvent(eventId) {
        this.eventStore.getEventByEventId(eventId).subscribe(event => {
            if (!event) { return console.log('could not find event. Please check logs') }

            this.navCtrl.push(EventOverviewPage, {
                event: event
            });
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

    openMessage() {
        this.navCtrl.push(ReadMessage)
    }
}