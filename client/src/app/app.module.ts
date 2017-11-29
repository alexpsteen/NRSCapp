import { NgModule, ErrorHandler } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpModule } from '@angular/http'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { FormsModule } from '@angular/forms'

import { MyApp } from './app.component'

import { LoginModal } from '../modal/login/login'
import { LogoutModal } from '../modal/logout/logout'

import { LoginPage } from "../pages/login/login";
import { HomePage } from "../pages/home/home";

import { AwsConfig } from './app.config'
import { AuthService, AuthServiceProvider } from './auth.service'
import { EventStore, EventStoreProvider } from "./event.store";
import { UserStore, UserStoreProvider } from "./user.store";
import { Sigv4Http, Sigv4HttpProvider } from './sigv4.service'

import { ChartsModule } from 'ng2-charts'
import { momentFromNowPipe } from './momentFromNow.pipe'

import { UserInfoPage } from "../pages/user-info/user-info";
import { EventDetailsPage } from "../pages/event-details/event-details";
import {EventOverviewPage} from "../pages/event-overview/event-overview";
import {FeatureCard} from "../components/feature-card/feature-card";
import {FeatureDetailsPage} from "../pages/feature-details/feature-details";
import {FeatureSelectionPage} from "../pages/feature-selection/feature-selection";
import {FeatureStore, FeatureStoreProvider} from "./feature.store";

import {FoodDetailsPage} from "../pages/feature-details/food/food";
import {VenueDetailsPage} from "../pages/feature-details/venue/venue";
import {MusicDetailsPage} from "../pages/feature-details/music/music";
import {ClothingDetailsPage} from "../pages/feature-details/clothing/clothing";
import {InboxHomePage} from "../pages/inbox-home/inbox-home";

import {VendorHomePage} from "../pages/vendor-home/vendor-home";
import {ReadMessage} from "../pages/read-message/read-message";
import {EventList} from "../pages/event-list/event-list";

import {ComposeMessagePage} from "../pages/compose-message/compose-message";
import {EditVendorProfilePage} from "../pages/edit-vendor-profile/edit-vendor-profile";
import {VendorEventOverviewPage} from "../pages/vendor-event-overview/vendor-event-overview";
import {VendorProfilePage} from "../pages/vendor-profile/vendor-profile";
import {EventPlannerHomePage} from "../pages/event-planner-home/event-planner-home";
import {HeaderBar} from "../components/header-bar/header-bar";
import {Camera} from "@ionic-native/camera";
import {MakeBidPage} from "../pages/make-bid/make-bid";


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    EventDetailsPage,
    LoginModal,
    LogoutModal,
    momentFromNowPipe,
    EventOverviewPage,
    FeatureCard,
    HeaderBar,
    FeatureDetailsPage,
    FeatureSelectionPage,
    FoodDetailsPage,
    MusicDetailsPage,
    VenueDetailsPage,
    ClothingDetailsPage,
    InboxHomePage,
    VendorHomePage,
    ReadMessage,
    EventList,
    ComposeMessagePage,
    EditVendorProfilePage,
    VendorProfilePage,
    EventPlannerHomePage,
    UserInfoPage,
      MakeBidPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, new AwsConfig().load()),
    FormsModule,
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    EventDetailsPage,
    LoginModal,
    LogoutModal,
    EventOverviewPage,
    FeatureDetailsPage,
    FeatureSelectionPage,
    FoodDetailsPage,
    MusicDetailsPage,
    VenueDetailsPage,
    ClothingDetailsPage,
    InboxHomePage,
    VendorHomePage,
    ReadMessage,
    EventList,
    ComposeMessagePage,
    EditVendorProfilePage,
    VendorProfilePage,
    EventPlannerHomePage,
    UserInfoPage,
      MakeBidPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService, AuthServiceProvider,
    EventStore, EventStoreProvider,
    FeatureStore, FeatureStoreProvider,
    UserStore, UserStoreProvider,
    Sigv4Http, Sigv4HttpProvider
  ]
})
export class AppModule {}

declare var AWS;
AWS.config.customUserAgent = AWS.config.customUserAgent + ' Ionic';