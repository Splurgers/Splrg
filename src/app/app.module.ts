import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Camera } from '@ionic-native/camera';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreLogMonitorModule, useLogMonitor } from '@ngrx/store-log-monitor';

import { FeedPage } from '../pages/feed/feed';
import { FormPage } from '../pages/form/form';
import { ListPage } from '../pages/list/list';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { SplurgeCard } from '../pages/list/splurge-card/splurge-card';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PostsService } from '../services/posts.service';

import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { user } from '../stores/user.store';
import { posts } from '../stores/posts.store';
import { splurges } from '../stores/splurges.store';

@NgModule({
  declarations: [
    MyApp,
    FeedPage,
    FormPage,
    ListPage,
    LoginPage,
    TabsPage,
    SplurgeCard
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
        HttpModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.provideStore({ posts, splurges, user }),
    StoreDevtoolsModule.instrumentStore({
      monitor: useLogMonitor({
        visible: false,
        position: 'right'
      })
    }),
    StoreLogMonitorModule,
    RoundProgressModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FeedPage,
    FormPage,
    ListPage,
    LoginPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PostsService,
    Camera
  ]
})
export class AppModule {}
