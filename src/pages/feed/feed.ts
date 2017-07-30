import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { POST } from '../../models/post.model';

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html'
})
export class FeedPage {
  POSTS: Array<POST>
  USER: string;

  constructor(public navCtrl: NavController) {
    this.USER = '1';
    let date = new Date();
    this.POSTS = [
      {
            user_id : '1',
            name: 'Arash',
            profile_url: 'https://lh3.google.com/u/0/d/0B625dxhXtFv-TURrNXVsNVFZMnM=w2228-h1352-iv1',
            description: 'buy one dog per year',
            id: '1',
            timestamp: date.toString(),
            status: 'Say hello to Harry! So excited to adopt one dog per year!',
            photo_url: 'https://pbs.twimg.com/media/BypeAXJIUAE8RKk.jpg',
            likes: ['1', '2']
      },
      {
        user_id : '2',
        name: 'Brendan',
        profile_url: 'https://pbs.twimg.com/profile_images/646429476096643072/S5PQqDy7.jpg',
        description: 'Eat Chocoate 3 X per day',
        id: '2',
        timestamp: date.toString(),
        status: '',
        photo_url: 'https://images-na.ssl-images-amazon.com/images/I/41D2vchR8HL._SX466_.jpg',
        likes: []
      }
    ];
  }

  hasLiked(array_liked_ids : Array<string>) {
    // TODO: USE global USER_ID but for now just hard code id to 1 in contoller;
    return array_liked_ids.find((id) => id === this.USER);

  }

  toggleLikePost(postId : string) {
    let post = this.POSTS.find((post) => post.id === postId);
    let userIndex = post.likes.indexOf(this.USER);

    // TODO: hit service to like POST for now just PUSH/SPLICE into post
    if (userIndex === -1) {
      post.likes.push(this.USER);
    } else { 
      post.likes.splice(userIndex, 1);
    }
  }
}
