import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';

import moment from 'moment'

import { Observable } from "rxjs/Observable";
import { SplurgeService } from '../../services/splurges.service';
import { SPLURGE } from '../../models/splurge.model';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  providers: [SplurgeService]
})
export class ListPage {
  SPLURGES: Observable<any>;


  constructor(public navCtrl: NavController,
              public splurgeService: SplurgeService,
              public toastCtrl: ToastController,
              public actionSheetCtrl: ActionSheetController) {

       this.SPLURGES = splurgeService.SPLURGES.map((arraySplurg) => arraySplurg.map((splurg) => this.decorateSplurge(splurg)));
       splurgeService.get();
  }

  addSplurge() {
    this.splurgeService.goToSplurgeForm();
  }

  decorateSplurge(splurge) {
    let done_count = 0;
    let createdAt = moment(splurge.created_at);
    let currentTime = moment();

    let diff = currentTime.diff(createdAt, splurge.period.toLowerCase(), true);
    // TODO: Check if this Math.floor is necessary
    let startOfLatestInterval = createdAt.add(Math.floor(diff), splurge.period.toLowerCase());

    for (let i = 0; i < splurge.uses_per_period; i++) {
      let use = splurge.use_dates[splurge.use_dates.length - (i + 1)];
      if (use && typeof use === 'object' && use.hasOwnProperty('date')) {
        if (moment(use.date).isBetween(startOfLatestInterval, currentTime)) done_count++
      }
    }

    return Object.assign(splurge, { splurges_left: splurge.uses_per_period - done_count})
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

    // TODO: Add disabled class to naughty tickers that have a zero value
    if (splurge.splurges_left === 0) return;

    let currentSplurges = [];
    let currentTime = moment().format();

    this.SPLURGES.subscribe(
      splurges => currentSplurges = splurges,
      error => console.error(error.json())
    );

    let selectedSplurge = currentSplurges.find((s) => s.id === splurge.id);
    // selectedSplurge.use_dates.push(currentTime);

    this.splurgeService.update(selectedSplurge);
  }
}
