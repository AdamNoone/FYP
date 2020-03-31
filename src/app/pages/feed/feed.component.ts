
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import {Subscription} from 'rxjs/Subscription';
import {PostsApiService} from 'src/app/pages/feed/posts-api.service';
import {Post} from 'src/app/pages/feed/post.model';
import {map, takeUntil, tap} from "rxjs/operators";
import {Observable, ReplaySubject, Subject} from "rxjs";
import {Food} from "../makepost/food.model";
import {BusinessApiService} from "../profile/businessdetails-api.service";
import {Business} from "../profile/business.model";

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
  private destroyed$ = new Subject<void>();
  private posts$ = new ReplaySubject<Post[]>();
  SearchTerm: string = '';


  business = {
    business_id : '',
    business_name: '',
    business_type : '',
    business_address: '',
    business_coordinates: '',
    business_description: '',
    business_footprint: '',
    business_level: 0,
    business_county: '',
    business_town: '',
  };

  constructor(private postsApi: PostsApiService,
              public auth: AuthService,
              private BusinessService: BusinessApiService) {
  }





  ngOnInit() {

      this.getPosts()

  }


  getPosts(): void {
    this.postsApi.getPosts().pipe(
      takeUntil(this.destroyed$)
    ).subscribe(posts => this.posts$.next(posts));
  }



  getPostSearch(): Observable<Post[]> {
    return this.posts$.pipe(
      map(eachPost => eachPost.filter(i => i.title.includes(this.SearchTerm) ||
        i.title.includes(this.SearchTerm[0].toUpperCase() + this.SearchTerm.slice(1)) ||
        i.description.includes(this.SearchTerm) ||
        i.description.includes(this.SearchTerm[0].toUpperCase() + this.SearchTerm.slice(1)) ||
        i.business_name.includes(this.SearchTerm) ||
        i.business_name.includes(this.SearchTerm[0].toUpperCase() + this.SearchTerm.slice(1)) ||
        i.business_address.includes(this.SearchTerm) ||
        i.business_address.includes(this.SearchTerm[0].toUpperCase() + this.SearchTerm.slice(1))
      ))
    );
  }



  GetPicture(picture: string) {

    const image: HTMLImageElement = document.getElementById('pic') as HTMLImageElement;
    image.src = picture;

  }
  ngOnDestroy() {
    //this.postsListSubs.unsubscribe();
  }



}


