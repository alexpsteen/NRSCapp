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
  public type;

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
      {type: 2, name: 'Music'},
      {type: 3, name: 'Clothing'},
    ];
  }

  select(type) {
    let page: any = FeatureDetailsPage;
    switch (type) {
      case 0:
        page = FoodDetailsPage;
        this.type = type;
        break;
      case 1:
        page = VenueDetailsPage;
        this.type = type;
        break;
      case 2:
        page = MusicDetailsPage;
        this.type = type;
        break;
      case 3:
        page = ClothingDetailsPage;
        this.type=type;
        break;
    }
    this.navCtrl.push(page, {
      eventId: this.eventId,
        type: this.type
    }).then(() => {
      const index = this.viewCtrl.index;
      this.navCtrl.remove(index);
    });
  }
}
