import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { POST } from '../../models/post.model';
import { UserService } from '../../services/user.service';
import { PostsService } from '../../services/posts.service';

import { Observable } from "rxjs/Observable";
import * as RTMClient from 'satori-sdk-js';


@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
  providers: [PostsService, UserService]
})
export class FeedPage {
  POSTS: Observable<Array<POST>>;
  USER: string;
  CLIENT: any;
  CHANNEL_NAME: string;

  constructor(public navCtrl: NavController,
              public postsService: PostsService,
              public userService: UserService) {

    this.POSTS = postsService.POSTS;

    postsService.get();
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

    var subscription = this.CLIENT.subscribe(this.CHANNEL_NAME, RTMClient.SubscriptionMode.SIMPLE);
    subscription.on("enter-subscribed",() => {
      console.log("Subscribed to the channel: " + this.CHANNEL_NAME);
    });
    subscription.on("rtm/subscribe/error", function(pdu) {
      console.log("Failed to subscribe: " + pdu.body.error + " - " + pdu.body.reason);
    });
    subscription.on("rtm/subscription/data", (pdu) => {
      pdu.body.messages.forEach((msg) => {
        let user;
        this.userService.user.subscribe((res) => {user = res; return res});
        // POST request callback adds it to store, no need to add it again.
        if (user.id != msg.user_id) {
          this.postsService.addToStore(msg)
        }
        console.log("Animal is received: " + msg);
      });
    });
  }

  createPost() {
    if (this.CLIENT.isConnected()) {

      // USER ID SHOULD USE GLOBAL USER
              let user;
              this.userService.user.subscribe((res) => {user = res; return res});
          var animal = {
            "user_id": user.id,
            "name": `ARASH TEST!!! ${Math.random().toString()}`,
            "profile_url": "http://static.buzznet.com/uploads/2011/10/msg-13175062972.jpg",
            "description": "Drink a glass of wine",
            "status": "Mmmm... do I taste notes of, uh, red?",
            "photo_url": "https://s-media-cache-ak0.pinimg.com/736x/af/7f/f2/af7ff2bec6283f929f2dcd66b806e656.jpg",
            "timestamp" : (new Date()).toString()
          }

          this.postsService.create(animal);
          
          this.CLIENT.publish(this.CHANNEL_NAME, animal, function(pdu) {
            if (pdu.action.endsWith("/ok")) {
              // Publish is confirmed by Satori RTM.
              console.log("Animal is published: " + JSON.stringify(animal));
            } else {
              console.log("Publish request failed: " + pdu.body.error + " - " + pdu.body.reason);
            }
          });
        }
  }

  hasLiked(array_liked_ids : Array<string>) {
    // TODO: USE global USER_ID but for now just hard code id to 1 in contoller;
    return true; // fake userID causes error; temp fix.
    // return array_liked_ids.find((id) => id === this.USER);

  }

  toggleLikePost(postId : string) {
    let currentPosts = [];

    this.POSTS.subscribe(
          currentPosts => currentPosts,
          error => console.error(error.json())
        );

    let post = currentPosts.find((post) => post.id === postId);
    let userIndex = post.likes.indexOf(this.USER);

    // TODO: hit service to like POST for now just PUSH/SPLICE into post
    if (userIndex === -1) {
      post.likes.push(this.USER);
    } else { 
      post.likes.splice(userIndex, 1);
    }
  }
}
