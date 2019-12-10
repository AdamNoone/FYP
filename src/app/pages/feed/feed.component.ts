import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  constructor(public auth: AuthService) {}

  ngOnInit() {
  }

}

/*
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {PostsApiService} from './posts-api.service';
import {Post} from './post.model';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnDestroy {
  title = 'app';
  postsListSubs: Subscription;
  postsList: Post[];

  constructor(private postsApi: PostsApiService) {
  }

  ngOnInit() {
    this.postsListSubs = this.postsApi
      .getPosts()
      .subscribe(res => {
          this.postsList = res;
        },
        console.error
      );
  }

  ngOnDestroy() {
    this.postsListSubs.unsubscribe();
  }
}
*/
