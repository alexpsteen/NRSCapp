import { Component } from '@angular/core'

import {AlertController, NavController, NavParams, ToastController, ViewController} from 'ionic-angular'

import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'
import { AuthService } from '../../app/auth.service'

import UUID from 'uuid'

import {EventStore} from "../../app/event.store";
import {IEvent} from "../../app/event.interface";
import {EventOverviewPage} from "../event-overview/event-overview";
import {List} from "immutable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {IUser} from "../../app/user.interface";
import {UserStore} from "../../app/user.store";

@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details.html'
})
export class EventDetailsPage {
  event:IEvent = {
    event_id: null,
    event_name: null,
    event_date_start: null,
    event_date_end: null,
    event_budget: null,
    event_status: 0
  };

  private parentPage;
  private _title:string;

  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    public auth: AuthService,
    public eventStore: EventStore,
    public userStore: UserStore,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {
    if (this.navParams.get('event')) {
      this.event = this.navParams.get('event');
    }
    if (this.navParams.get('parentPage')) {
      this.parentPage = this.navParams.get('parentPage');
    }
    if (this.navParams.get('title')) {
      this._title = this.navParams.get('title');
    }
  }

  get title():string { return this._title }

  // ionViewDidEnter() {
  //   if (this.parentPage && this.parentPage.loading) {
  //     this.parentPage.loading.dismiss();
  //   }
  // }

  get userColor ():string {
    return this.auth.isUserSignedIn() ? 'secondary' : 'primary'
  }

  saveEvent () {
    if (this.event.event_id) {
      this.eventStore.updateEvent(this.event).subscribe(event => {
        if (event) {
          if (this.parentPage.doRefresh) {
            this.parentPage.doRefresh();
          }
          if (this.parentPage.event) {
            this.parentPage.event = this.event;
          }
          this.navCtrl.pop();
          this.doToast('Event updated successfully');
        } else {
          console.log('Could not update event. Please see logs');
        }
      });
    } else {
      this.eventStore.addEvent(this.event).subscribe(event => {
        if (event) {
          this.navCtrl.push(EventOverviewPage, {
            event: this.event
          }).then(() => {
            const index = this.viewCtrl.index;
            this.navCtrl.remove(index);
          });
          this.doToast('Event created successfully');
        } else {
          console.log('Could not add event. Please see logs');
        }
      });
    }
  }

  confirmDelete() {
    const alert = this.alertCtrl.create({
      title: 'Delete?',
      message: 'Delete this event?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.eventStore.deleteEvent(this.event.event_id).subscribe(event => {
              if (event) {
                const index = this.viewCtrl.index;
                this.navCtrl.remove(index - 1);
                this.navCtrl.pop();
                this.doToast('Event deleted successfully');
              } else {
                console.log('Could not delete event. Please see logs');
              }
            });
          }
        }
      ]
    });

    alert.present();
  }

  doToast(text:string) {
    this.toastCtrl.create({
      message: text,
      position: 'top',
      duration: 3000
    }).present();
  }
}
