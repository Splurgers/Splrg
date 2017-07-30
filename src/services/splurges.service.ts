import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';

import {Store} from '@ngrx/store';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

import { ModalController } from 'ionic-angular';

import { appState } from '../models/appState.model';
import { SPLURGE } from '../models/splurge.model';

const BASE_LB_URL = `${window.location.href.indexOf('localhost') !== -1 ? window.location : 'http://splrg.herokuapp.com/'}api/`;

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

  delete(splurge: SPLURGE) {
    this.http.delete(`${BASE_LB_URL}SplurgeData/${splurge.id}`)
      .map(res => res.json())
      .subscribe(action => this.store.dispatch({ type: 'DELETE_SPLURGE', payload : splurge }));
  }

  create(splurge: SPLURGE) {
    this.http.post(`${BASE_LB_URL}SplurgeData`, splurge)
          .map(res => res.json())
          .map(payload => ({ type: 'CREATE_SPLURGE', payload }))
          .subscribe(action => this.store.dispatch(action));
  }

  update(selectedSplurge) {
    this.http.patch(`${BASE_LB_URL}SplurgeData/${selectedSplurge.id}`, selectedSplurge)
          .map(res => res.json())
          .map(payload => ({ type: 'UPDATE_SPLURGE', payload }))
          .subscribe(action => this.store.dispatch(action));
  }

  addUseDateToSplurge(selectedSplurge) {

    this.http.post(`${BASE_LB_URL}SplurgeData/${selectedSplurge.id}/UseDates`, {})
          .map(res => res.json())
          .map(res => {
            selectedSplurge.use_dates = [...selectedSplurge.use_dates, res];
            return ({ type: 'UPDATE_SPLURGE', payload: selectedSplurge });
          })
          .subscribe(action => this.store.dispatch(action));
  }
}
