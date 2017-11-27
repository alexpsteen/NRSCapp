import { Injectable } from '@angular/core'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/concatAll'
import 'rxjs/add/operator/share'
import { List } from 'immutable'
import { Sigv4Http } from './sigv4.service'
// import * as _orderBy from 'lodash.orderby'
import * as _ from 'lodash'
import { Config } from 'ionic-angular'
import { AuthService } from './auth.service'
import {
    IFeatureLite, IFeatureClothing, IFeatureFood, IFeatureMusic, IFeatureVenue,
    IRecommendation, IBid, IVendorBid
} from "./feature.interface";
import {IVendorLite} from "./user.interface";

let featureStoreFactory = (sigv4: Sigv4Http, auth: AuthService, config: Config) => { return new FeatureStore(sigv4, auth, config) };

export let FeatureStoreProvider = {
  provide: FeatureStore,
  useFactory: featureStoreFactory,
  deps: [Sigv4Http, AuthService]
};

@Injectable()
export class FeatureStore {

  private _features: BehaviorSubject<List<IFeatureLite>> = new BehaviorSubject(List([]));
  private _vendors: BehaviorSubject<List<IBid>> = new BehaviorSubject(List([]));
  private endpoint:string;

  constructor (private sigv4: Sigv4Http, private auth: AuthService, private config: Config) {
    this.endpoint = this.config.get('APIs')['FeaturesAPI'];
  }

  get features () { return Observable.create( fn => this._features.subscribe(fn) ) }

  get vendors () { return Observable.create( fn => this._vendors.subscribe(fn))}

  vendorRefresh(id): Observable<any> {
    if(this.auth.isUserSignedIn()) {
      let observable = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `features/all?task=bid&id=${id}`, creds)).concatAll().share();
      observable.subscribe(resp => {
        console.log(resp);
        let data = resp.json();
        this._vendors.next(List(this.sortVendors(data.vendors)));
      });
      return observable;
    } else {
      this._vendors.next(List([]));
      return Observable.from([]);
    }
  }

  refresh (id) : Observable<any> {
    if (this.auth.isUserSignedIn()) {
      let observable = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `features/all?task=event&id=${id}`, creds)).concatAll().share();
      observable.subscribe(resp => {
        console.log(resp);
        let data = resp.json();
        this._features.next(List(this.sort(data.features)));
      });
      return observable;
    } else {
      this._features.next(List([]));
      return Observable.from([]);
    }
  }

  addFeature (feature): Observable<any> {
    let observable = this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, 'features?task=feature', feature, creds)).concatAll().share();

    observable.subscribe(resp => {
      if (resp.status === 200) {
        let features = this._features.getValue().toArray();
        let feature = resp.json().feature;
        features.push(feature);
        this._features.next(List(this.sort(features)));
      }
    });
    return observable.map(resp => resp.status === 200 ? resp.json().feature : null);
  }


    getFeature (index): Observable<any> {
        let features = this._features.getValue().toArray();
        let obs = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `features/details?task=feature&id=${features[index].feature_id}&type=${features[index].feature_type}`, creds)).concatAll().share();

        return obs.map(resp => resp.status === 200 ? resp.json().features[0] : null);
    }

    getVendorDetails(index, featureId):Observable<any> {
      let vendors = this._vendors.getValue().toArray();
      let obs = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `features/details?task=vendorBid&id=${featureId}`,creds)).concatAll().share();

      return obs.map(resp => resp.status === 200 ? resp.json() : null);
    }

    getRecommendedVendor(featureId): Observable<any> {
      let obs = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `features/details?task=recommendation&id=${featureId}`, creds)).concatAll().share();

      return obs.map(resp => resp.status === 200 ? resp.json() : null);
    }

  updateFeature (feature): Observable<any> {
    // let tasks = this._tasks.getValue().toArray()
    let obs = this.auth.getCredentials().map(creds => this.sigv4.put(
      this.endpoint,
      `features?task=feature&id=${feature.featureId}`,
      feature,
      creds)).concatAll().share();

    // obs.subscribe(resp => {
    //   if (resp.status === 200) {
    //     tasks[index] = resp.json().task
    //     this._tasks.next(List(this.sort(tasks)))
    //   }
    // })

    return obs.map(resp => resp.status === 200 ? resp.json().feature : null)
  }

  confirmRecommendation(featureId): Observable<IRecommendation> {
    let obs = this.auth.getCredentials().map(creds => this.sigv4.put(this.endpoint, `features?task=confirm`, featureId,creds)).concatAll().share();
    return obs.map(resp => resp.status === 200 ? resp.json() : null);
  }

  rejectRecommendation(featureId): Observable<IRecommendation> {
    let obs = this.auth.getCredentials().map(creds => this.sigv4.put(this.endpoint, `features?task=reject`, featureId, creds)).concatAll().share();
    return obs.map(resp => resp.status === 200 ? resp.json() : null);
  }

  addBid (bid): Observable<IBid> {
      let obs = this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, `features?task=bid`, bid,creds)).concatAll().share();
      return obs.map(resp => resp.status === 200 ? resp.json() : null);
  }

  addRecommendation (recommendation): Observable<IRecommendation> {
      let obs = this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, `features?task=recommendation`, recommendation,creds)).concatAll().share();
      return obs.map(resp => resp.status === 200 ? resp.json() : null);
  }

  deleteFeature (featureId): Observable<IFeatureLite> {
    let features = this._features.getValue().toArray();
    let obs = this.auth.getCredentials().map(creds => this.sigv4.del(this.endpoint, `features?id=${featureId}`, creds)).concatAll().share();

    obs.subscribe(resp => {
      if (resp.status === 200) {
        let index = _.findIndex(features, (f) => {return f.featureId === featureId} );
        features.splice(index, 1)[0];
        this._features.next(List(<IFeatureLite[]>features));
      }
    });
    return obs.map(resp => resp.status === 200 ? resp.json().feature : null)
  }

  private sortVendors(vendors:IBid[]): IBid[] {
    return _.orderBy(vendors, ['vendor_id'], ['asc'])
  }

  private sort (features:IFeatureLite[]): IFeatureLite[] {
    return _.orderBy(features, ['type'], ['asc'])
  }

}