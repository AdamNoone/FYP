
import {Component, OnDestroy, OnInit} from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import {Subscription} from 'rxjs/Subscription';
import {PostsApiService} from 'src/app/pages/feed/posts-api.service';
import {Post} from 'src/app/pages/feed/post.model';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})


export class FeedComponent implements OnInit, OnDestroy {
  title = 'app';
  postsListSubs: Subscription;
  postsList: Post[];
  private posts: Post[];


  constructor(private postsApi: PostsApiService, public auth: AuthService ) {
  }

  ngOnInit() {
    this.postsListSubs = this.postsApi
      .getPosts()
      .subscribe(res => {
        this.postsList = res


        },
        console.error
      );
  }

  GetPicture(picture: string) {

    const image: HTMLImageElement = document.getElementById('pic') as HTMLImageElement;
    image.src = picture;

  }
  ngOnDestroy() {
    this.postsListSubs.unsubscribe();
  }

  getPosts(): void {
    this.postsApi.getPosts()
      .subscribe(posts => this.postsList = posts);
  }

}


