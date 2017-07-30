import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

import { appState } from '../models/appState.model';

const BASE_LB_URL = location.hostname === 'localhost' ? 'api/': 'http://splrg.herokuapp.com/api/';

@Injectable()
export class PostsService {
  POSTS: Observable<Array<any>>;

  constructor(private http: Http, private store: Store<appState>) {
      this.POSTS = store.select('posts');
  }

  get() {
    this.http.get(`${BASE_LB_URL}Posts`)
      .map(res => res.json())
      .map(payload => ({ type: 'ADD_POSTS', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  create(post) {
    this.http.post(`${BASE_LB_URL}Posts`, post)
          .map(res => res.json())
          .map(payload => ({ type: 'CREATE_POST', payload }))
          .subscribe(action => this.store.dispatch(action));
  }
    
  addToStore(post) {
    this.store.dispatch({ type: 'CREATE_POST', payload: post })
  }
}
