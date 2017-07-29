import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';

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
              public toastCtrl: ToastController,
              public actionSheetCtrl: ActionSheetController) {
    this.dogs = dogsService.dogs;

    dogsService.loadItems();
    dogsService.loadSplurges();
  }

  showSplurgeCardActions(splurge) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Splurge Actions',
      buttons: [
        {
          text: 'Edit',
          role: 'destructive',
          handler: () => {
            console.log('Edit clicked');
            // pass in splurge to form
          }
        },{
          text: 'Delete',
          handler: () => {
            // pass in splurge.id to API
            this.dogsService.delete('DEFAULT');
            let toast = this.toastCtrl.create({
              message: 'You deleted Splurge.Descripton :/',
              duration: 3000,
              position: 'top'
            });
            toast.present();
          }
        }
      ]
    });
    actionSheet.present();
  }
}
