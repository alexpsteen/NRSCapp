import {Component, Input} from "@angular/core";
import {AuthService} from "../../app/auth.service";
import {ModalController} from "ionic-angular";
import {LogoutModal} from "../../modal/logout/logout";
import {LoginModal} from "../../modal/login/login";

@Component({
  selector: 'header-bar',
  templateUrl: 'header-bar.html'
})
export class HeaderBar {

  constructor(
      public modalCtrl: ModalController,
      public auth: AuthService,
  ){}

  @Input() title: string;

  openLoginModal () {
    let modal = this.modalCtrl.create(this.auth.isUserSignedIn() ? LogoutModal : LoginModal);
    modal.present()
  }

  get userColor ():string {
    return this.auth.isUserSignedIn() ? 'secondary' : 'primary'
  }

}