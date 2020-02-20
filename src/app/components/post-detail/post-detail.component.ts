import { Component, OnInit, Input } from '@angular/core';
import {Post} from 'src/app/pages/feed/post.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {PostsApiService} from 'src/app/pages/feed/posts-api.service';
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  @Input() post: Post;
  auth: any;

  constructor(
    private route: ActivatedRoute,
    private postService: PostsApiService,
    private location: Location) {

  }

  ngOnInit(): void {
    this.getPost();
  }

  getPost(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.postService.getPostbyID(id)
      .pipe(
      tap(post=> console.log("hello", post))
      )
      .subscribe(post=> this.post = post);
  }

  goBack(): void {
    this.location.back();
  }
}
