import {Component, OnDestroy, OnInit} from '@angular/core';

import {Subscription} from 'rxjs/Subscription';
import {PostsApiService} from 'src/app/pages/feed/posts-api.service';
import {Post} from 'src/app/pages/feed/post.model';
import {BusinessApiService} from 'src/app/pages/profile/businessdetails-api.service';
import {Business} from 'src/app/pages/profile/business.model';
import {UserApiService} from 'src/app/pages/profile/userdetails-api.service';
import {User} from 'src/app/pages/profile/user.model';
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
  UsersListSubs: Subscription;
  UsersList: User[];


  constructor(private postsApi: PostsApiService, private businessesApi: BusinessApiService,private usersApi: UserApiService ) {
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

    this.UsersListSubs = this.usersApi
      .getUsers()
      .subscribe(res => {
          this.UsersList = res;
        },
        console.error
      );
  }

  ngOnDestroy() {
    this.postsListSubs.unsubscribe();
  }
}

