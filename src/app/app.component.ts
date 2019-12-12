import {Component, OnDestroy, OnInit} from '@angular/core';

import {Subscription} from 'rxjs/Subscription';
import {PostsApiService} from 'src/app/pages/feed/posts-api.service';
import {Post} from 'src/app/pages/feed/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit, OnDestroy {
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

