import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';

import {Store} from '@ngrx/store';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import * as RTMClient from 'satori-sdk-js';

import { ModalController } from 'ionic-angular';

import { appState } from '../models/appState.model';
import { SPLURGE } from '../models/splurge.model';
import { PostsService } from './posts.service';

const BASE_LB_URL = 'api/';

@Injectable()
export class SplurgeService {
  SPLURGES: Observable<Array<any>>;
  CLIENT: any;
  CHANNEL_NAME: string;
  user:any;

  constructor(private http: Http, private store: Store<appState>, public modalCtrl: ModalController, public postsService: PostsService) {
    this.SPLURGES = store.select('splurges');
    console.log(postsService);
    this.user = store.select('user');
    this.initSatori();
  }

  initSatori() {

    var endpoint = 'wss://cbw0as1p.api.satori.com';
    var appkey = 'e65d10E50Aab0A46767B75b9Bdcb002d';
    var role = 'arash';
    var roleSecret = '15CBcCD0cFC50DCBBb1Cb8a4E4dB78E0';
    this.CHANNEL_NAME = "POSTS";

    var shouldAuthenticate = "YOUR_ROLE" != role;
    var authProvider;
    if (shouldAuthenticate) {
        authProvider = RTMClient.roleSecretAuthProvider(role, roleSecret);
    }
    this.CLIENT = new RTMClient(endpoint, appkey, { authProvider: authProvider });
    
    this.CLIENT.on("enter-connected", function () {
        console.log("Connected to Satori RTM!");
      });
    this.CLIENT.on("leave-connected", function () {
      console.log("Disconnected from Satori RTM");
    });
    this.CLIENT.on("error", function (error) {
      var reason;
      if (error.body) {
        reason = error.body.error + " - " + error.body.reason;
      } else {
        reason = "unknown reason";
      }
      console.log("RTM this.CLIENT failed: " + reason);
    });

    this.CLIENT.start();

    // var subscription = this.CLIENT.subscribe(this.CHANNEL_NAME, RTMClient.SubscriptionMode.SIMPLE);
    // subscription.on("enter-subscribed",() => {
    //   console.log("Subscribed to the channel: " + this.CHANNEL_NAME);
    // });
    // subscription.on("rtm/subscribe/error", function(pdu) {
    //   console.log("Failed to subscribe: " + pdu.body.error + " - " + pdu.body.reason);
    // });
    // subscription.on("rtm/subscription/data", (pdu) => {
    //   pdu.body.messages.forEach((msg) => {
    //     let user;
    //     this.userService.user.subscribe((res) => {user = res; return res});
    //     // POST request callback adds it to store, no need to add it again.
    //     if (user.id != msg.user_id) {
    //       this.postsService.addToStore(msg)
    //     }
    //     console.log("Animal is received: " + msg);
    //   });
    // });
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
    let obs = this.http.post(`${BASE_LB_URL}SplurgeData`, splurge)
          .map(res => res.json())
          .map(payload => ({ type: 'CREATE_SPLURGE', payload }));
    obs.subscribe(action => this.store.dispatch(action));
    return obs;
  }

  update(selectedSplurge) {
    let obs = this.http.patch(`${BASE_LB_URL}SplurgeData/${selectedSplurge.id}`, selectedSplurge)
          .map(res => res.json())
          .map(payload => ({ type: 'UPDATE_SPLURGE', payload }));
    obs.subscribe(action => this.store.dispatch(action));
    return obs;
  }

  addUseDateToSplurge(selectedSplurge) {
        console.log(selectedSplurge);

    if (this.CLIENT.isConnected()) {
        console.log(selectedSplurge, 'connected');
      // USER ID SHOULD USE GLOBAL USER
              let user;
              this.user.subscribe((res) => {user = res; return res});
              console.log('user!!', user);
          var animal = {
            "user_id": user.id,
            "name": user.username,
            "profile_url": user.profile_url,
            "description": 'dank',
            "status": `I did it!! ${selectedSplurge.description}`,
            "photo_url": "https://s-media-cache-ak0.pinimg.com/736x/af/7f/f2/af7ff2bec6283f929f2dcd66b806e656.jpg",
            "timestamp" : (new Date()).toString()
          }

          this.postsService.create(animal);
          
          this.CLIENT.publish(this.CHANNEL_NAME, animal, function(pdu) {
            if (pdu.action.endsWith("/ok")) {
              console.log("Animal is published: " + JSON.stringify(animal));
            } else {
              console.log("Publish request failed: " + pdu.body.error + " - " + pdu.body.reason);
            }
          });
        }

    this.http.post(`${BASE_LB_URL}SplurgeData/${selectedSplurge.id}/UseDates`, {})
          .map(res => res.json())
          .map(res => {
            selectedSplurge.use_dates = [...selectedSplurge.use_dates, res];
            return ({ type: 'UPDATE_SPLURGE', payload: selectedSplurge });
          })
          .subscribe(action => this.store.dispatch(action));
  }
}
