import {Injectable} from '@angular/core';

import { ModalController } from 'ionic-angular';

import { FormPage } from '../pages/form/form';

import { SPLURGE } from '../models/splurge.model';

@Injectable()
export class SplurgeActionsService {

  constructor(public modalCtrl: ModalController) {}

  goToSplurgeForm(splurgeToEdit? : SPLURGE) {
    let modal = this.modalCtrl.create(FormPage, splurgeToEdit);
    modal.present();
  }
}