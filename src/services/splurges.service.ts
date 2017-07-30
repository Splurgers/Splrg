import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';

import {Store} from '@ngrx/store';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

import { ModalController } from 'ionic-angular';

import { FormPage } from '../pages/form/form';

import { appState } from '../models/appState.model';
import { SPLURGE } from '../models/splurge.model';

const BASE_LB_URL = 'api/';

@Injectable()
export class SplurgeService {
  SPLURGES: Observable<Array<any>>;

  constructor(private http: Http, private store: Store<appState>, public modalCtrl: ModalController) {
    this.SPLURGES = store.select('splurges');
  }

  get() {
    this.http.get(`${BASE_LB_URL}SplurgeData`)
      .map(res => res.json())
      .map(payload => ({ type: 'ADD_SPLURGES', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  delete(item: string) {
    this.store.dispatch({ type: 'DELETE_POST', payload: item });
  }

  goToSplurgeForm(splurgeToEdit? : SPLURGE) {
    let modal = this.modalCtrl.create(FormPage, splurgeToEdit);
    modal.present();
  }

  update(selectedSplurge) {

    this.http.post(`${BASE_LB_URL}SplurgeData/${selectedSplurge.id}/UseDates`, {})
          .map(res => res.json())
          .map(test => {
            selectedSplurge.use_dates = [...selectedSplurge.use_dates, test];
            let x = selectedSplurge;
            console.log(selectedSplurge);
            return ({ type: 'UPDATE_SPLURGE', payload: x });
          })
          .subscribe(action => {
            console.log('action', action);
            this.store.dispatch(action)
          });
  }
}