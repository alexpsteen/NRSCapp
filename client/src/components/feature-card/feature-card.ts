import {Component, Input} from '@angular/core'

import {NavController} from 'ionic-angular'

@Component({
  selector: 'feature-card',
  templateUrl: 'feature-card.html'
})
export class FeatureCard {
  _feature:any;
  @Input()
  get feature() { return this._feature }

  set feature(val:any) { this._feature = val }

  constructor(
    public navCtrl: NavController) {}

  get featureName():string {
    switch(this.feature.feature_type) {
      case 0:
        return 'Food';
      case 1:
        return 'Venue';
      case 2:
        return 'Music';
      case 3:
        return 'Clothing';
      default:
        return '[Unknown]';
    }
  }

  get featureIcon():string {
    switch(this.feature.feature_type) {
      case 0:
        return 'restaurant';
      case 1:
        return 'pin';
      case 2:
        return 'musical-notes';
      case 3:
        return 'bowtie';
      default:
        return 'bug';
    }
  }

}
