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

const BASE_LB_URL = location.hostname === 'localhost' ? 'api/': 'http://splrg.herokuapp.com/api/';

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

    if (this.CLIENT.isConnected()) {
      // USER ID SHOULD USE GLOBAL USER
      let user;
      this.user.subscribe((res) => { user = res; return res });
      let photoURL = user.id === 1 ? 'https://store.storeimages.cdn-apple.com/8750/as-images.apple.com/is/image/AppleInc/aos/published/images/4/2/42/hermes/42-hermes-singletour-fauve-grid-201703?wid=270&hei=275&fmt=jpeg&qlt=95&op_sharpen=0&resMode=bicub&op_usm=0.5,0.5,0,0&iccEmbed=0&layer=comp&.v=1489516185164' : 'http://www.coca-colaproductfacts.com/content/dam/productfacts/us/productDetails/ProductImages/DietCoke_12oz.png'
      var animal = {
        "user_id": user.id,
        "name": user.username,
        "profile_url": user.profile_url,
        "description": 'dank',
        "status": `Good times! ${selectedSplurge.description}`,
        "photo_url": photoURL,
        "timestamp": (new Date()).toString()
      }

      this.postsService.create(animal);

      this.CLIENT.publish(this.CHANNEL_NAME, animal, function (pdu) {
        if (pdu.action.endsWith("/ok")) {
          // console.log("Animal is published: " + JSON.stringify(animal));
        } else {
          console.log("Publish request failed: " + pdu.body.error + " - " + pdu.body.reason);
        }
      });
    }

    // Optimistic Render
    var lastSplurgeUse = selectedSplurge.use_dates[selectedSplurge.use_dates.length - 1];
    var newSplurgeUse = {
      date : new Date(),
      id: lastSplurgeUse + 1  || 1
    }
    selectedSplurge.use_dates = [...selectedSplurge.use_dates, newSplurgeUse];
    this.store.dispatch({ type: 'UPDATE_SPLURGE', payload: selectedSplurge })

    this.http.post(`${BASE_LB_URL}SplurgeData/${selectedSplurge.id}/UseDates`, {})
          .subscribe(
            (action) => console.log('Splurge updated on backend'),
            (err) => {
              selectedSplurge.use_dates.pop();
              this.store.dispatch({ type: 'UPDATE_SPLURGE', payload: selectedSplurge })
              // TODO: Use common error service to show notification.
              console.log(err);
            }
          );
  }
}
