import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ListPage } from '../list/list';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  email: string = 'brendan@splurge.com';
  password: string = 'yolo';

  constructor(public navCtrl: NavController) {

  }

  login(): void {
    // TODO: communicate w/ backend
    this.navCtrl.push(ListPage);

  }
}

