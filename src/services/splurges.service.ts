import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';

import {Store} from '@ngrx/store';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

import { ModalController } from 'ionic-angular';

import { FormPage } from '../pages/form/form';

import { appState } from '../models/appState.model';
import { SPLURGE } from '../models/splurge.model';

const BASE_URL = 'https://dog.ceo/api/';
const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class SplurgeService {
  dogs: Observable<Array<any>>;

  constructor(private http: Http, private store: Store<appState>, public modalCtrl: ModalController) {
    this.dogs = store.select('dogs');
  }

  loadItems() {
    this.http.get(`${BASE_URL}breeds/list`)
      .map(res => res.json())
      .map(payload => ({ type: 'ADD_DOGS', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  delete(item: string) {
    this.store.dispatch({ type: 'DELETE_ITEM', payload: item });
  }

  goToSplurgeForm(splurgeToEdit? : SPLURGE) {
    let modal = this.modalCtrl.create(FormPage, splurgeToEdit);
    modal.present();
  }
}