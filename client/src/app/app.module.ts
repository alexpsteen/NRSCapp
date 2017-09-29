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
import { Sigv4Http, Sigv4HttpProvider } from './sigv4.service'

import { ChartsModule } from 'ng2-charts'
import { momentFromNowPipe } from './momentFromNow.pipe'

import { EventDetailsPage } from "../pages/event-details/event-details";

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
    momentFromNowPipe
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
    AddTaskModal
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService, AuthServiceProvider,
    ProjectStore, ProjectStoreProvider,
    TaskStore, TaskStoreProvider,
    EventStore, EventStoreProvider,
    Sigv4Http, Sigv4HttpProvider
  ]
})
export class AppModule {}
