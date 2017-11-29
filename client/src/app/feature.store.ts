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
    IFeature, IFeatureClothing, IFeatureFood, IFeatureMusic, IFeatureVenue,
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

  private _features: BehaviorSubject<List<IFeature>> = new BehaviorSubject(List([]));
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

  getBiddingVendors(id): Observable<any> {
      return this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `features/all?task=bid&id=${id}`, creds)).concatAll().share().map(this.multipleResult);
  }

  getFeatures(id): Observable<IFeature[]> {
      return this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `features/all?task=event&id=${id}`, creds)).concatAll().share().map(this.multipleResult);
  }

  addFeature (feature): Observable<any> {
    return this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, 'features?task=feature', feature, creds)).concatAll().share().map(this.singularResult);
  }


    getFeature (featureId, featureType): Observable<any> {
        return this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `features/details?task=feature&id=${featureId}&type=${featureType}`, creds)).concatAll().share().map(this.singularResult);
    }

    getVendorDetails(vendorId, featureId):Observable<any> {
      return this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `features/details?task=vendorBid&featureId=${featureId}&vendorId=${vendorId}`,creds)).concatAll().share().map(this.singularResult);
    }

    getRecommendedVendor(featureId): Observable<any> {
      return this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `features/details?task=recommendation&id=${featureId}`, creds)).concatAll().share().map(this.singularResult);
    }

  updateFeature (feature): Observable<any> {
    return this.auth.getCredentials().map(creds => this.sigv4.put(
      this.endpoint,
      `features?task=feature&id=${feature.featureId}`,
      feature,
      creds)).concatAll().share().map(this.singularResult);

  }

  confirmRecommendation(featureId): Observable<IRecommendation> {
    return this.auth.getCredentials().map(creds => this.sigv4.put(this.endpoint, `features?task=confirm&featureId=${featureId}`, null,creds)).concatAll().share().map(this.singularResult);
  }

  rejectRecommendation(featureId): Observable<IRecommendation> {
    return this.auth.getCredentials().map(creds => this.sigv4.put(this.endpoint, `features?task=reject&featureId=${featureId}`, null, creds)).concatAll().share().map(this.singularResult);
  }

  addBid (bid): Observable<IBid> {
      return this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, `features?task=bid`, bid,creds)).concatAll().share().map(this.singularResult);
  }

  addRecommendation (recommendation): Observable<IRecommendation> {
      return this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, `features?task=recommendation`, recommendation,creds)).concatAll().share().map(this.singularResult);
  }

  deleteFeature (featureId): Observable<IFeature> {
    return this.auth.getCredentials().map(creds => this.sigv4.del(this.endpoint, `features?id=${featureId}`, creds)).concatAll().share().map(this.singularResult);
  }

  private sortVendors(vendors:IBid[]): IBid[] {
    return _.orderBy(vendors, ['vendor_id'], ['asc'])
  }

  private sort (features:IFeature[]): IFeature[] {
    return _.orderBy(features, ['type'], ['asc'])
  }

    private singularResult(resp) {
        return resp.status === 200 ? resp.json() : null;
    }

    private multipleResult(resp) {
        if (resp.status === 200) {
            let data = resp.json();
            if (data && !Array.isArray(data)) {
                return [data];
            }
            return data;
        }
        return [];
    }


}