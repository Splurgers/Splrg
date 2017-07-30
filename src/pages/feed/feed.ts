import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { POST } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';

import { Observable } from "rxjs/Observable";
import * as RTMClient from 'satori-sdk-js';


@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
  providers: [PostsService]
})
export class FeedPage {
  POSTS: Observable<Array<POST>>;
  USER: string;
  CLIENT: string;

  constructor(public navCtrl: NavController,
              private postsService: PostsService,) {

    this.POSTS = postsService.POSTS;

    postsService.get();
    this.initSatori();
  }

  initSatori() {
    var endpoint = 'wss://cbw0as1p.api.satori.com';
    var appkey = 'e65d10E50Aab0A46767B75b9Bdcb002d';
    var role = 'arash';
    var roleSecret = '15CBcCD0cFC50DCBBb1Cb8a4E4dB78E0';
    var channelName = "POSTS";

    var shouldAuthenticate = "YOUR_ROLE" != role;
    var authProvider;
    if (shouldAuthenticate) {
        authProvider = RTMClient.roleSecretAuthProvider(role, roleSecret);
    }
    var client = new RTMClient(endpoint, appkey, { authProvider: authProvider });
    
  client.on("enter-connected", function () {
      console.log("Connected to Satori RTM!");
    });
    client.on("leave-connected", function () {
      console.log("Disconnected from Satori RTM");
    });
    client.on("error", function (error) {
      var reason;
      if (error.body) {
        reason = error.body.error + " - " + error.body.reason;
      } else {
        reason = "unknown reason";
      }
      console.log("RTM client failed: " + reason);
    });

    client.start();

       // Show information about the client configuration
      var configInfo = "RTM client config:<br />";
      configInfo += "&nbsp;&nbsp;endpoint = '" + endpoint + "'<br />";
      configInfo += "&nbsp;&nbsp;appkey = '" + appkey + "'<br />";
      configInfo += "&nbsp;&nbsp;authenticate? = " + shouldAuthenticate;
      if (shouldAuthenticate) {
        configInfo += " (as " + role + ")";
      }
      console.log(configInfo);

      // At this point, the client may not yet be connected to Satori RTM.
      // The SDK internally creates a subscription object and will subscribe
      // once the client connects.
      var subscription = client.subscribe(channelName, RTMClient.SubscriptionMode.SIMPLE);
      subscription.on("enter-subscribed", function() {
        // When subscription is established (confirmed by Satori RTM).
        console.log("Subscribed to the channel: " + channelName);
      });
      subscription.on("rtm/subscribe/error", function(pdu) {
        // When a subscribe error occurs.
        console.log("Failed to subscribe: " + pdu.body.error + " - " + pdu.body.reason);
      });
      subscription.on("rtm/subscription/data", function(pdu) {
        // Messages arrive in an array.
        pdu.body.messages.forEach(function(msg) {
          console.log("Animal is received: " + JSON.stringify(msg));
        });
      });

      var publishLoop  = function() {
        // At this point, the client may not yet be connected to Satori RTM.
        // If client is not connected then skip publishing.
        if (client.isConnected()) {
          var lat = 34.134358 + (Math.random() / 100);
          var lon = -118.321506 + (Math.random() / 100);
          var animal = {
            who: "zebra",
            where: [lat, lon]
          };
          client.publish(channelName, animal, function(pdu) {
            if (pdu.action.endsWith("/ok")) {
              // Publish is confirmed by Satori RTM.
              console.log("Animal is published: " + JSON.stringify(animal));
            } else {
              console.log("Publish request failed: " + pdu.body.error + " - " + pdu.body.reason);
            }
          });
        }
      }
      setInterval(publishLoop, 2000);
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
