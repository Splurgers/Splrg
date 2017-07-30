import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

import { appState } from '../models/appState.model';

const BASE_URL = 'https://dog.ceo/api/';
const BASE_LB_URL = 'api/';
const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class DogsService {
  dogs: Observable<Array<any>>;

  constructor(private http: Http, private store: Store<appState>) {
    this.dogs = store.select('dogs');
  }

  loadItems() {
    this.http.get(`${BASE_URL}breeds/list`)
      .map(res => res.json())
      .map(payload => ({ type: 'ADD_DOGS', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  // BRENDAN TESTING FOR API - not hooked to anything
  loadSplurges() {
    this.http.get(`${BASE_LB_URL}Tests`)
      .map(res => res.json())
      .subscribe(data => console.log('resp: ', data));
  }

  delete(item: string) {
    this.store.dispatch({ type: 'DELETE_ITEM', payload: item });
  }

  // saveItem(item: Item) {
  //   (item.id) ? this.updateItem(item) : this.createItem(item);
  // }

  // createItem(item: Item) {
  //   this.http.post(`${BASE_URL}`, JSON.stringify(item), HEADER)
  //     .map(res => res.json())
  //     .map(payload => ({ type: 'CREATE_ITEM', payload }))
  //     .subscribe(action => this.store.dispatch(action));
  // }

  // updateItem(item: Item) {
  //   this.http.put(`${BASE_URL}${item.id}`, JSON.stringify(item), HEADER)
  //     .subscribe(action => this.store.dispatch({ type: 'UPDATE_ITEM', payload: item }));
  // }
}
