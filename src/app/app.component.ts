import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NavController } from 'ionic-angular';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { UserService } from '../services/user.service';


@Component({
  templateUrl: 'app.html',
  providers: [UserService]
})
export class MyApp {
  @ViewChild('myNav') nav: NavController;
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private userService: UserService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      let user = JSON.parse(localStorage.getItem('user'));
      if (user && typeof user === 'object' && user.hasOwnProperty('id')) {
        this.userService.setCachedUser(user);
      } else {
        this.nav.push(LoginPage);
      }

    });
  }
}
