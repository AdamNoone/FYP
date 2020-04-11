import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {PostsApiService} from "../feed/posts-api.service";
import {Location} from "@angular/common";
import {Subscription} from "rxjs";
import {Post} from "../feed/post.model";

@Component({
  selector: 'app-myposts',
  templateUrl: './myposts.component.html',
  styleUrls: ['./myposts.component.css']
})
export class MypostsComponent implements OnInit {
  title = 'app';
  postsListSubs: Subscription;
  postsList: Post[];
  private posts: Post[];
  private profileJson: string;

  constructor(public auth: AuthService, private postsApi: PostsApiService,private location: Location) { }

  ngOnInit(): void {
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
