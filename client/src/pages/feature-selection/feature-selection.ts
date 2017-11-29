import { Component } from '@angular/core'

import {NavController, NavParams, ViewController} from 'ionic-angular'
import { AuthService } from '../../app/auth.service'
import {FeatureDetailsPage} from "../feature-details/feature-details";
import {VenueDetailsPage} from "../feature-details/venue/venue";
import {FoodDetailsPage} from "../feature-details/food/food";
import {MusicDetailsPage} from "../feature-details/music/music";
import {ClothingDetailsPage} from "../feature-details/clothing/clothing";

@Component({
  selector: 'page-feature-selection',
  templateUrl: 'feature-selection.html'
})
export class FeatureSelectionPage {
  public featureTypes:any[];
  private eventId:string;

  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    public navParams: NavParams) {
    if (this.navParams.get('eventId')) {
      this.eventId = this.navParams.get('eventId');
    }
    this.featureTypes = [
      {type: 0, name: 'Venue'},
      {type: 1, name: 'Food'},
      {type: 2, name: 'Music'},
      {type: 3, name: 'Clothing'},
    ];
  }

  select(type) {
    let page: any = FeatureDetailsPage;
    switch (type) {
      case 0:
        page = VenueDetailsPage;
        break;
      case 1:
        page = FoodDetailsPage;
        break;
      case 2:
        page = MusicDetailsPage;
        break;
      case 3:
        page = ClothingDetailsPage;
        break;
    }
    this.navCtrl.push(page, {
      eventId: this.eventId
    }).then(() => {
      const index = this.viewCtrl.index;
      this.navCtrl.remove(index);
    });
  }
}
