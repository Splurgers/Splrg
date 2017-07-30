import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';

import moment from 'moment'

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
  SPLURGES: Array<SPLURGE>


  constructor(public navCtrl: NavController,
              private dogsService: DogsService,
              private splurgeService: SplurgeService,
              public toastCtrl: ToastController,
              public actionSheetCtrl: ActionSheetController) {
    this.dogs = dogsService.dogs;

    dogsService.loadItems();
    dogsService.loadSplurges();
    dogsService.loadPosts();

       let splurges = [
         {
            description: 'I should only have one use day left, I already used two today. I created this splurge yesterday',
            period: 'MONTH',
            number: 5,
            use_dates: ['2017-7-29 4:30', '2017-7-29 4:31'],
            id: '1',
            created_at: '2010-7-28 4:30'
         }
       ];

       this.SPLURGES = splurges.map((splurge) => this.decorateSplurge(splurge));
  }

  addSplurge() {
    this.splurgeService.goToSplurgeForm();
  }

  decorateSplurge(splurge) {
    let done_count = 0;
    let createdAt = moment(splurge.created_at, "YYYY-MM-DD HH:mm");
    let currentTime = moment();

    let diff = currentTime.diff(createdAt, splurge.period.toLowerCase(), true);
    // TODO: Check if this Math.floor is necessary
    let startOfLatestInterval = createdAt.add(Math.floor(diff), splurge.period.toLowerCase());

    for (let i = 0; i < splurge.number; i++) {
      let enity = splurge.use_dates[splurge.use_dates.length - (i + 1)];
      if (enity) {
        if (moment(enity).isBetween(startOfLatestInterval, currentTime)) done_count++
      }
    }

    return Object.assign(splurge, { splurges_left: splurge.number - done_count})
  }

  showSplurgeCardActions(splurge: SPLURGE) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Splurge Actions',
      buttons: [
        {
          text: 'Edit',
          role: 'destructive',
          handler: () => {
            this.splurgeService.goToSplurgeForm(splurge);
          }
        },{
          text: 'Delete',
          handler: () => {
            // pass in splurge.id to API
            let toast = this.toastCtrl.create({
              message: `You deleted ${splurge.description}`,
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

  useSplurge(event, splurge) {
    event.stopPropagation();
    let currentTime = moment().format("YYYY-MM-DD HH:mm");;
    let selectedSplurge = this.SPLURGES.find((s) => s.id === splurge.id);
    selectedSplurge.use_dates.push(currentTime);
    this.SPLURGES = this.SPLURGES.map((splurge) => this.decorateSplurge(splurge));
  }
}
