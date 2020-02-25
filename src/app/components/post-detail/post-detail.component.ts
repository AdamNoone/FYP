/// <reference types="@types/googlemaps" />
import { Component, OnInit, Input,AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {Post} from 'src/app/pages/feed/post.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {PostsApiService} from 'src/app/pages/feed/posts-api.service';
import {tap} from "rxjs/operators";
import {BusinessApiService} from "../../pages/profile/businessdetails-api.service";
import {Business} from "../../pages/profile/business.model";
import {} from 'googlemaps';


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


