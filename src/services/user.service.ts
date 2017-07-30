import {Http} from '@angular/http';
import {Injectable} from '@angular/core';

import {Store} from '@ngrx/store';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { appState } from '../models/appState.model';

const BASE_LB_URL = 'http://splrg.herokuapp.com/api/';

@Injectable()
export class UserService {
  user: Observable<object>;

  constructor(private http: Http, private store: Store<appState>) {
    this.user = store.select('user');
  }

  login(email: string, password: string) {
    let post = this.http.post(`${BASE_LB_URL}SplurgeUsers/login`, {email: email, password: password})
      .map(res => res.json())
      .mergeMap(userAuth => this.fetchUser(userAuth.id, userAuth.userId))
      .map(payload => ({ type: 'ADD_USER', payload }));
      post.subscribe(action => this.store.dispatch(action));
    return post;
  }

  fetchUser(auth: string, id: number) {
    return this.http.get(`${BASE_LB_URL}SplurgeUsers/${id}/?access_token=${auth}`)
      .map(res => res.json());
  }

}
