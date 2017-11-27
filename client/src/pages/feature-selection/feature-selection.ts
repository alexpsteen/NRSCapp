import { Component } from '@angular/core'

import {NavController, NavParams, ViewController} from 'ionic-angular'
import { AuthService } from '../../app/auth.service'
import {FeatureDetailsPage} from "../feature-details/feature-details";
import {FoodDetailsPage} from "../feature-details/food/food";
import {VenueDetailsPage} from "../feature-details/venue/venue";
import {ClothingDetailsPage} from "../feature-details/clothing/clothing";
import {MusicDetailsPage} from "../feature-details/music/music";

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
      {type: 0, name: 'Food'},
      {type: 1, name: 'Venue'},
      {type: 2, name: 'Clothing'},
      {type: 3, name: 'Music'},
    ];
  }

  select(index) {
    var nextPage = null;
    switch (index) {
        case 0:
            nextPage = FoodDetailsPage
            break;
        case 1:
            nextPage = VenueDetailsPage;
            break;
        case 2:
            nextPage = ClothingDetailsPage;
            break;
        case 3:
            nextPage = MusicDetailsPage;
            break;
    }
    if (nextPage != null) {
      this.navCtrl.push(nextPage, {
        type: index,
        eventId: this.eventId
      }).then(() => {
        const index = this.viewCtrl.index;
        this.navCtrl.remove(index);
      });
    }
  }
}
