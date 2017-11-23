import { NgModule, ErrorHandler } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpModule } from '@angular/http'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { FormsModule } from '@angular/forms'

import { MyApp } from './app.component'

import { TasksPage } from '../pages/tasks/tasks'
import { ProjectOverviewPage } from '../pages/project-overview/project-overview'
import { TabsPage } from '../pages/tabs/tabs'
import { LoginModal } from '../modal/login/login'
import { LogoutModal } from '../modal/logout/logout'
import { AddTaskModal } from '../modal/addtask/addtask'

import { LoginPage } from "../pages/login/login";
import { HomePage } from "../pages/home/home";

import { AwsConfig } from './app.config'
import { AuthService, AuthServiceProvider } from './auth.service'
import { ProjectStore, ProjectStoreProvider } from './project.store'
import { TaskStore, TaskStoreProvider } from './task.store'
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


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    EventDetailsPage,
    TasksPage,
    ProjectOverviewPage,
    TabsPage,
    LoginModal,
    LogoutModal,
    AddTaskModal,
    momentFromNowPipe,
    EventOverviewPage,
    FeatureCard,
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
    UserInfoPage
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
    TasksPage,
    ProjectOverviewPage,
    TabsPage,
    LoginModal,
    LogoutModal,
    AddTaskModal,
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
    UserInfoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService, AuthServiceProvider,
    ProjectStore, ProjectStoreProvider,
    TaskStore, TaskStoreProvider,
    EventStore, EventStoreProvider,
    FeatureStore, FeatureStoreProvider,
    UserStore, UserStoreProvider,
    Sigv4Http, Sigv4HttpProvider
  ]
})
export class AppModule {}
