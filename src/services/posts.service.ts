import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

import { appState } from '../models/appState.model';

const BASE_LB_URL = `${window.location.href.indexOf('localhost') !== -1 ? window.location : 'http://splrg.herokuapp.com/'}api/`;

@Injectable()
export class PostsService {
  POSTS: Observable<Array<any>>;

  constructor(private http: Http, private store: Store<appState>) {
      this.POSTS = store.select('posts');
      alert(`base url: ${BASE_LB_URL}`);
  }

  get() {
    this.http.get(`${BASE_LB_URL}Posts`)
      .map(res => res.json())
      .map(payload => ({ type: 'ADD_POSTS', payload }))
      .subscribe(action => this.store.dispatch(action));
  }
}
