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
import {IFeature} from "./feature.interface";

let featureStoreFactory = (sigv4: Sigv4Http, auth: AuthService, config: Config) => { return new FeatureStore(sigv4, auth, config) };

export let FeatureStoreProvider = {
  provide: FeatureStore,
  useFactory: featureStoreFactory,
  deps: [Sigv4Http, AuthService]
};

@Injectable()
export class FeatureStore {

  private _features: BehaviorSubject<List<IFeature>> = new BehaviorSubject(List([]));
  private endpoint:string;

  constructor (private sigv4: Sigv4Http, private auth: AuthService, private config: Config) {
    this.endpoint = this.config.get('APIs')['FeaturesAPI'];
    this.refresh();
  }

  get features () { return Observable.create( fn => this._features.subscribe(fn) ) }

  refresh () : Observable<any> {
    if (this.auth.isUserSignedIn()) {
      let observable = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, 'features', creds)).concatAll().share();
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

  addFeature (feature): Observable<IFeature> {
    let observable = this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, 'features', feature, creds)).concatAll().share();

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

  getFeature (index): Observable<IFeature> {
    let features = this._features.getValue().toArray();
    let obs = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `features/${features[index].featureId}`, creds)).concatAll().share();

    return obs.map(resp => resp.status === 200 ? resp.json().features[0] : null)
  }

  getFeatureById (id): Observable<IFeature> {
    let obs = this.auth.getCredentials().map(creds => this.sigv4.get(this.endpoint, `features/${id}`, creds)).concatAll().share();

    return obs.map(resp => resp.status === 200 ? resp.json().features[0] : null)
  }

  updateFeature (feature): Observable<IFeature> {
    // let tasks = this._tasks.getValue().toArray()
    let obs = this.auth.getCredentials().map(creds => this.sigv4.put(
      this.endpoint,
      `features/${feature.featureId}`,
      event,
      creds)).concatAll().share();

    // obs.subscribe(resp => {
    //   if (resp.status === 200) {
    //     tasks[index] = resp.json().task
    //     this._tasks.next(List(this.sort(tasks)))
    //   }
    // })

    return obs.map(resp => resp.status === 200 ? resp.json().feature : null)
  }

  deleteFeature (featureId): Observable<IFeature> {
    let features = this._features.getValue().toArray();
    let obs = this.auth.getCredentials().map(creds => this.sigv4.del(this.endpoint, `features/${featureId}`, creds)).concatAll().share();

    obs.subscribe(resp => {
      if (resp.status === 200) {
        let index = _.findIndex(features, (f) => {return f.featureId === featureId} );
        features.splice(index, 1)[0];
        this._features.next(List(<IFeature[]>features));
      }
    });
    return obs.map(resp => resp.status === 200 ? resp.json().feature : null)
  }

  private sort (features:IFeature[]): IFeature[] {
    return _.orderBy(features, ['type'], ['asc'])
  }

}