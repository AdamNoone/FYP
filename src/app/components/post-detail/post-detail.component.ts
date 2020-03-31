/// <reference types="@types/googlemaps" />
import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Post} from 'src/app/pages/feed/post.model';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {AuthService} from 'src/app/auth/auth.service';
import {PostsApiService} from 'src/app/pages/feed/posts-api.service';
import {tap} from "rxjs/operators";
import {BusinessApiService} from "../../pages/profile/businessdetails-api.service";
import {Business} from "../../pages/profile/business.model";
import {UserApiService} from "../../pages/profile/userdetails-api.service";


@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit,AfterViewInit {
  map: google.maps.Map;
  @ViewChild('mapWrapper', {static: false}) mapElement: ElementRef;

  @Input() business: Business;
  private profileJson: string;
  private user_pos;
  private pos;

  user = {
    user_id : '',
    user_email : '',
    user_name: '',
    user_address: '',
    user_coordinates: '',
    user_footprint: '',
    user_level: 0,



  };

  post = {
    title: '',
    description: '',
    picture: '',
    business: '',
    ingredients:'',
    carbon_footprint: 0,
    portion: 0,
    price:'',
    collection_time:'',
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

    getLocation();
  }



  getPost(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.postService.getPostbyID(id)
      .pipe(
      tap(post=> this.getBusiness(post.business))
      )
      .subscribe(post=> {
        this.post = post;
        this.InsertIngredient(this.post.ingredients);
      })
  }


  getBusiness(buisness_id: string): void {
    this.BusinessService.getBusinessbyBusinessID(buisness_id)
      .pipe(
        tap(business=> this.initializeMap(business.business_coordinates,business.business_name))
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
      .subscribe(post=> {
        this.post;
        this.DeleteTable();
        this.getPost();

      })
  }

  goBack(): void {
    this.user_pos = {};
    this.pos = {};
    this.location.back();
  }


  initializeMap(business_coordinates: string | any, business_name: string | any) {

        var directionsService = new google.maps.DirectionsService();
        var directionsRenderer = new google.maps.DirectionsRenderer();
        //console.log("this is x", business_coordinates);

     var user_location = document.getElementById("demo").innerText;
      let userLat = parseFloat(user_location.split(" ")[0]); ///before;
      let userLng = parseFloat(user_location.split(" ")[1]); ///after;



        let lat = parseFloat(business_coordinates.split(" ")[0]); ///before;
        let lng = parseFloat(business_coordinates.split(" ")[1]); ///after;


        const lngLat = new google.maps.LatLng(lat, lng);
        const mapOptions: google.maps.MapOptions = {
          center: lngLat,
          zoom: 14,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
         this.pos = {lat: lat, lng: lng};
        var marker = new google.maps.Marker({
          position: this.pos,
          map: this.map,
          title: business_name
        });

        this.user_pos = {lat: userLat, lng: userLng};
        var marker2 = new google.maps.Marker({
          position: this.user_pos,
          map: this.map,
          title: "your position"
        });
        directionsRenderer.setMap(this.map);

        calculateAndDisplayRoute(directionsService, directionsRenderer,this.user_pos, this.pos);

        function calculateAndDisplayRoute(directionsService, directionsRenderer, pos, pos2) {
          directionsService.route(
            {
              origin: pos,
              destination: pos2,
              travelMode: 'DRIVING'
            },
            function (response, status) {
              if (status === 'OK') {
                directionsRenderer.setDirections(response);
              } else {
                window.alert('Directions request failed due to ' + status);
              }
            });
        }
      }

  InsertIngredient(ingredients: string) {

    console.log(ingredients);
    let tableRef = document.getElementById("Chosen_InIngredients") as HTMLTableElement;

    var food = ingredients.split(',');
    console.log(food);
    var i;
    for(i =0; i < food.length; i++)
    {
      var single = food[i].split('/');

        // Insert a row at the end of the table
        let newRow = tableRef.insertRow(-1);
        // Insert a cell in the row at index 0
        let newCellFood = newRow.insertCell(0);
        let newCellCF = newRow.insertCell(1);

        // Append a text node to the cell
        let newFoodText = document.createTextNode(single[0]);
        let newCFText = document.createTextNode(single[1]);
        newCellFood.appendChild(newFoodText);
        newCellCF.appendChild(newCFText);
    }


  }

  DeleteTable() {
    let table = document.getElementById("Chosen_InIngredients") as HTMLTableElement;
    while(table.rows.length > 1) {
      table.deleteRow(1);
    }
}


}





function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    var x = document.getElementById("demo");
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  var x = document.getElementById("demo");
  x.innerHTML = position.coords.latitude +
    " " + position.coords.longitude;
}
