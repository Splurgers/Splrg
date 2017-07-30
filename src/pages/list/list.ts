import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';

import { Observable } from "rxjs/Observable";
import { DogsService } from '../../services/dogs.service';
import { SplurgeService } from '../../services/splurges.service';
import { SPLURGE } from '../../models/splurge.model';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  providers: [DogsService, SplurgeService]
})
export class ListPage {
  dogs: Observable<Array<string>>;


  constructor(public navCtrl: NavController,
              private dogsService: DogsService,
              private splurgeService: SplurgeService,
              public toastCtrl: ToastController,
              public actionSheetCtrl: ActionSheetController) {
    this.dogs = dogsService.dogs;

    dogsService.loadItems();
    dogsService.loadPosts();
  }

  showSplurgeCardActions(splurge: SPLURGE) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Splurge Actions',
      buttons: [
        {
          text: 'Edit',
          role: 'destructive',
          handler: () => {
            // TODO: update to not use hard coded splurge

            let mockObject = {
                description: 'test',
                period: "MONTH",
                number: 1,
                use_dates: [],
                id: '1'
            };

            this.splurgeService.goToSplurgeForm(mockObject);
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
