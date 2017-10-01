import { Component } from '@angular/core'

import {NavController} from 'ionic-angular'
import { ModalController } from 'ionic-angular'

import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'
import { AuthService } from '../../app/auth.service'

import {EventDetailsPage} from "../event-details/event-details";
import {EventStore} from "../../app/event.store";
import {EventOverviewPage} from "../event-overview/event-overview";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public auth: AuthService,
    public eventStore: EventStore) { }

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

  addTapped() {
    this.navCtrl.push(EventDetailsPage, {
      title: 'Edit Event Details'
    });
  }

  editEvent(index) {
    this.eventStore.getEvent(index).subscribe(event => {
      if (!event) { return console.log('could not find event. Please check logs') }

      this.navCtrl.push(EventOverviewPage, {
        event: event
      });
    })
  }

  openLoginModal () {
    let modal = this.modalCtrl.create(this.auth.isUserSignedIn() ? LogoutModal : LoginModal);
    modal.present()
  }

  get userColor ():string {
    return this.auth.isUserSignedIn() ? 'secondary' : 'primary'
  }
}
