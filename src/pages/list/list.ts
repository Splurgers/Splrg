import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';

import moment from 'moment'

import { Observable } from "rxjs/Observable";
import { SplurgeService } from '../../services/splurges.service';
import { SplurgeActionsService } from '../../services/splurge_actions.service';
import { SPLURGE } from '../../models/splurge.model';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  providers: [SplurgeService, SplurgeActionsService]
})
export class ListPage {
  SPLURGES: Observable<any>;


  constructor(public navCtrl: NavController,
              public splurgeService: SplurgeService,
              public splurgeActionsService: SplurgeActionsService,
              public toastCtrl: ToastController,
              public actionSheetCtrl: ActionSheetController) {

      // TODO: Understand observables so code below actually works
      //  this.SPLURGES = splurgeService.SPLURGES.map((arraySplurg) => arraySplurg.map((splurg) => this.decorateSplurge(splurg)));
       this.SPLURGES = splurgeService.SPLURGES
       splurgeService.get();
  }

  addSplurge() {
    this.splurgeActionsService.goToSplurgeForm();
  }

  // TODO: Make this work properly with the this.SPLURGES...for now just use helper methods in view
  // decorateSplurge(splurge) {
  //   let done_count = 0;
  //   let createdAt = moment(splurge.created_at);
  //   let currentTime = moment();

  //   let diff = currentTime.diff(createdAt, splurge.period.toLowerCase(), true);
  //   // TODO: Check if this Math.floor is necessary
  //   let startOfLatestInterval = createdAt.add(Math.floor(diff), splurge.period.toLowerCase());

  //   for (let i = 0; i < splurge.uses_per_period; i++) {
  //     let use = splurge.use_dates[splurge.use_dates.length - (i + 1)];
  //     if (use && typeof use === 'object' && use.hasOwnProperty('date')) {
  //       if (moment(use.date).isBetween(startOfLatestInterval, currentTime)) done_count++
  //     }
  //   }

  //   return Object.assign(splurge, { splurges_left: splurge.uses_per_period - done_count})
  // }

   getSplurgesLeft(splurge) {
    if (splurge && typeof splurge === 'object' && splurge.hasOwnProperty('created_at')) {
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
      return splurge.uses_per_period - done_count;
    } else {
      return 0;
    }
  }

  showSplurgeCardActions(splurge: SPLURGE) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Splurge Actions',
      buttons: [
        {
          text: 'Edit',
          role: 'destructive',
          handler: () => {
            this.splurgeActionsService.goToSplurgeForm(splurge);
          }
        },{
          text: 'Delete',
          handler: () => {
            this.splurgeService.delete(splurge);
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
    // if (splurge.splurges_left === 0) return;
    if (this.getSplurgesLeft(splurge) === 0) return;

    let currentSplurges = [];
    let currentTime = moment().format();

    this.SPLURGES.subscribe(
      splurges => currentSplurges = splurges,
      error => console.error(error.json())
    );

    let selectedSplurge = currentSplurges.find((s) => s.id === splurge.id);
    this.splurgeService.addUseDateToSplurge(selectedSplurge);
  }
}
