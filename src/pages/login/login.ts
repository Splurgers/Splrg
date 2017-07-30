import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { UserService } from '../../services/user.service';

import 'rxjs/add/operator/mergeMap';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [UserService]
})
export class LoginPage {
  email: string = 'brendan@splurge.com';
  password: string = 'yolo';

  constructor(public navCtrl: NavController,
              private userService: UserService) {

  }

  login(): void {
    // TODO: communicate w/ backend
    this.userService.login(this.email, this.password)
      .subscribe(() => this.navCtrl.push(TabsPage));
  }
}

