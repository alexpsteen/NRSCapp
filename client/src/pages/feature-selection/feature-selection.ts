import { Component } from '@angular/core'

import {NavController, NavParams, ViewController} from 'ionic-angular'
import { AuthService } from '../../app/auth.service'
import {FeatureDetailsPage} from "../feature-details/feature-details";

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
      {type: 2, name: 'Drinks'},
      {type: 3, name: 'Cake'},
      {type: 4, name: 'Flowers'},
      {type: 5, name: 'Music'},
    ];
  }

  select(index) {
    this.navCtrl.push(FeatureDetailsPage, {
      type: index,
      eventId: this.eventId
    }).then(() => {
      const index = this.viewCtrl.index;
      this.navCtrl.remove(index);
    });
  }
}
