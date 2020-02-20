import { Component, OnInit, Input } from '@angular/core';
import {Post} from 'src/app/pages/feed/post.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {PostsApiService} from 'src/app/pages/feed/posts-api.service';
import {tap} from "rxjs/operators";
import {BusinessApiService} from "../../pages/profile/businessdetails-api.service";
import {Business} from "../../pages/profile/business.model";

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  @Input() post: Post;
  @Input() business: Business;
  auth: any;

  constructor(
    private route: ActivatedRoute,
    private postService: PostsApiService,
    private BusinessService: BusinessApiService,
    private location: Location) {

  }

  ngOnInit(): void {
    this.getPost();
  }

  getPost(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.postService.getPostbyID(id)
      .pipe(
      tap(post=> this.getBusiness(post.business))
      )
      .subscribe(post=> this.post = post);
  }


  getBusiness(buisness_id: string): void {
    this.BusinessService.getBusinessbyBusinessID(buisness_id)
      .pipe(
        tap(business=> console.log("hello from business", business))
      )
      .subscribe(business=> this.business = business);
  }


  goBack(): void {
    this.location.back();
  }
}
