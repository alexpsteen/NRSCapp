import {Component, Input} from "@angular/core";
import {AuthService} from "../../app/auth.service";
import {ModalController} from "ionic-angular";
import {LogoutModal} from "../../modal/logout/logout";
import {LoginModal} from "../../modal/login/login";
import {UserStore} from "../../app/user.store";
import {UserType} from "../../app/user.interface";
import {UserInfoPage} from "../../pages/user-info/user-info";

@Component({
  selector: 'header-bar',
  templateUrl: 'header-bar.html'
})
export class HeaderBar {

  constructor(
      public modalCtrl: ModalController,
      public auth: AuthService,
      public userStore: UserStore
  ){}

  @Input() title: string;

  openLoginModal () {
    this.userStore.getCurrentUser().subscribe(user => {
      if (user.user_type == UserType.VENDOR) {
        this.userStore.getVendorLiteById(user.user_id).subscribe(vendor => {
          let modal = this.modalCtrl.create(UserInfoPage, {user: user, vendor: vendor});
          modal.present();
        });
      } else {
        let modal = this.modalCtrl.create(UserInfoPage, {user: user});
        modal.present();
      }
    });

  }

  get userColor ():string {
    return this.auth.isUserSignedIn() ? 'secondary' : 'primary'
  }

}