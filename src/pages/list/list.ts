import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { Observable } from "rxjs/Observable";
import { DogsService } from '../../services/dogs.service';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  providers: [DogsService]
})
export class ListPage {
  dogs: Observable<Array<string>>;

  constructor(public navCtrl: NavController,
              private dogsService: DogsService,
              public toastCtrl: ToastController) {
    this.dogs = dogsService.dogs;

    dogsService.loadItems();
  }

  delete(dog) {
    this.dogsService.delete(dog);
    let toast = this.toastCtrl.create({
      message: 'You deleted the dog :/',
      duration: 3000
    });
    toast.present();
  }

}
