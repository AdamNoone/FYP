/// <reference types="@types/googlemaps" />
import { Component, OnInit, Input,AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {Post} from 'src/app/pages/feed/post.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {AuthService} from 'src/app/auth/auth.service';
import {PostsApiService} from 'src/app/pages/feed/posts-api.service';
import {tap} from "rxjs/operators";
import {BusinessApiService} from "../../pages/profile/businessdetails-api.service";
import {Business} from "../../pages/profile/business.model";
import {} from 'googlemaps';
import {UserApiService} from "../../pages/profile/userdetails-api.service";


@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit,AfterViewInit {
  map: google.maps.Map;
  @ViewChild('mapWrapper', {static: false}) mapElement: ElementRef;
  @Input() post: Post;
  @Input() business: Business;
  private profileJson: string;

  user = {
    user_id : '',
    user_email : '',
    user_name: '',
    user_address: '',
    user_coordinates: '',
    user_footprint: '',
    user_level: 0,



  };

  constructor(
    private route: ActivatedRoute,
    private postService: PostsApiService,
    private BusinessService: BusinessApiService,
    private usersApi: UserApiService,
    private location: Location,
    public auth: AuthService) {

  }

  ngOnInit(): void {
    this.getPost();
    this.auth.userProfile$.subscribe(
      profile => this.profileJson = JSON.stringify(profile, null, 2))


    var test = JSON.parse(this.profileJson);
    var user_id = test.sub.replace(/\|/g, "")
    this.get_userbyUserID(user_id);

  }

  ngAfterViewInit() {

    //this.initializeMap();
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
        tap(business=> this.initializeMap(business.business_coordinates,business.business_name,))
      )
      .subscribe(business=> this.business = business);
  }

  get_userbyUserID(user_id: string): void {
    this.usersApi.get_userbyUserID(user_id)
      .subscribe(user=> this.user = user);
  }


  update(user_id: string, post_footprint: number, post_id: number) :void {
    console.log("button pressed");
    this.usersApi.UpdateUser(user_id,String(post_footprint))
      .subscribe(user=> this.user);

    this.postService.UpdatePortion(String(post_id))
      .subscribe(post=> this.post);
       location.reload();
  }

  goBack(): void {
    this.location.back();
  }


  initializeMap(business_coordinates: string | any, business_name: string | any) {
    console.log("this is x",business_coordinates);

     let lat = parseFloat(business_coordinates.split(" ")[0]); ///before;
     let lng = parseFloat(business_coordinates.split(" ")[1]); ///after;

    const lngLat = new google.maps.LatLng(lat , lng);
    const mapOptions: google.maps.MapOptions = {
      center: lngLat,
      zoom: 14,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    var pos = {lat: lat,lng: lng};
    var marker = new google.maps.Marker({
      position: pos,
      map: this.map,
      title: business_name
    });
  }
}


