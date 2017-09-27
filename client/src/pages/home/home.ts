import { Component } from '@angular/core'

import { NavController } from 'ionic-angular'
import { ModalController } from 'ionic-angular'

import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'
import { AuthService } from '../../app/auth.service'

// import _ from 'lodash'
import * as _groupBy from 'lodash.groupby'
import * as _map from 'lodash.map'
import { List } from 'immutable'

import { IProject } from '../../app/project.interface'
import { ProjectStore } from '../../app/project.store'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public auth: AuthService,
    public store: ProjectStore) { }

  doRefresh (refresher) {
    let subscription = this.store.refresh().subscribe({
      complete: () => {
        subscription.unsubscribe();
        refresher.complete();
      }
    })
  }

  openModal () {
    let modal = this.modalCtrl.create(this.auth.isUserSignedIn() ? LogoutModal : LoginModal)
    modal.present()
  }

  get userColor ():string {
    return this.auth.isUserSignedIn() ? 'secondary' : 'primary'
  }
}
