import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { POST } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';

import { Observable } from "rxjs/Observable";

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
  providers: [PostsService]
})
export class FeedPage {
  POSTS: Observable<Array<POST>>;
  USER: string;

  constructor(public navCtrl: NavController,
              private postsService: PostsService,) {

    this.POSTS = postsService.POSTS;

    postsService.get();
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
