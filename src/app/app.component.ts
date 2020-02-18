import {Component, OnDestroy, OnInit} from '@angular/core';

import {Subscription} from 'rxjs/Subscription';
import {PostsApiService} from 'src/app/pages/feed/posts-api.service';
import {Post} from 'src/app/pages/feed/post.model';
import {BusinessApiService} from 'src/app/pages/profile/userdetails-api.service';
import {Business} from 'src/app/pages/profile/business.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  postsListSubs: Subscription;
  postsList: Post[];
  BusinessesListSubs: Subscription;
  BusinessesList: Business[];


  constructor(private postsApi: PostsApiService, private businessesApi: BusinessApiService ) {
  }

  ngOnInit() {
    this.postsListSubs = this.postsApi
      .getPosts()
      .subscribe(res => {
          this.postsList = res;
        },
        console.error
      );

    this.BusinessesListSubs = this.businessesApi
      .getBusinesses()
      .subscribe(res => {
          this.BusinessesList = res;
        },
        console.error
      );
  }

  ngOnDestroy() {
    this.postsListSubs.unsubscribe();
  }
}

