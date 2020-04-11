import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Subscription} from 'rxjs/Subscription';
import {PostsApiService} from 'src/app/pages/feed/posts-api.service';
import {Post} from 'src/app/pages/feed/post.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-recyclepost',
  templateUrl: './recyclepost.component.html',
  styleUrls: ['./recyclepost.component.css']
})
export class RecyclepostComponent implements OnInit {
  title = 'app';
  postsListSubs: Subscription;
  postsList: Post[];
  private posts: Post[];
  private profileJson: string;

  constructor(public auth: AuthService, private postsApi: PostsApiService,private location: Location) { }

  ngOnInit() {

    this.auth.userProfile$.subscribe(
      profile => this.profileJson = JSON.stringify(profile, null, 2));
    var test = JSON.parse(this.profileJson);
    var business = test.sub;
    this.postsListSubs = this.postsApi
      .getPostbyBusiness(test.sub.replace(/\|/g, ""))
      .subscribe(res => {
          this.postsList = res;
        },
        console.error
      );
}

  goBack(): void {
    this.location.back();
  }
}
