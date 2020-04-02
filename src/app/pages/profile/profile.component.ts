import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/auth/auth.service';
import {BusinessApiService} from 'src/app/pages/profile/businessdetails-api.service';
import {UserApiService} from 'src/app/pages/profile/userdetails-api.service';
import {Router} from "@angular/router";
import axios from 'axios';
import {tap} from "rxjs/operators";
import {User} from "./user.model";

export interface Trophy {
  name: string;
  description: string;
  dateEarned: Date;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileJson: string = null;
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

  user = {
    user_id : '',
    user_email : '',
    user_name: '',
    user_address: '',
    user_coordinates: '',
    user_footprint: '',
    user_level: 0,
  };

  trophies = [];

  constructor(public auth: AuthService, private businessesApi: BusinessApiService,private usersApi: UserApiService, private router: Router) {
  }

  ngOnInit() {
    this.auth.userProfile$.subscribe(
      profile => this.profileJson = JSON.stringify(profile, null, 2)
    );



    console.log(this.profileJson);
    var test = JSON.parse(this.profileJson);
    console.log(test);
    var firstLoginKey = "http://localhost:3000/first_login";
    let n = test[firstLoginKey];
    console.log(n);
    var user_id = test.sub.replace(/\|/g, "")


    if (n === true) {
      this.openForm();
    }
    this.get_userbyUserID(user_id);
    this.getBusinessbyBusinessID(user_id);
  }



  get_userbyUserID(user_id: string) {
    this.usersApi.get_userbyUserID(user_id)
      .subscribe(user=> {
        this.user = user;

        if (this.user.user_id == user_id)
        {
          this.closeForm();
          this.getTrophies();
          this.FootprintAnimate();
          document.getElementById("user").style.display = "block";
          document.getElementById("business").style.display = "none";
        }

      });

  }


  getBusinessbyBusinessID(business_id: string) {
    this.businessesApi.getBusinessbyBusinessID(business_id)
      .subscribe(business=> {
        this.business = business;


        if (this.business.business_id == business_id)
        {
          this.closeForm();
          this.getTrophies2();
          this.FootprintAnimate2();
          document.getElementById("user").style.display = "none";
          document.getElementById("business").style.display = "block";
        }
      });

  }



  openForm() {
    document.getElementById("TypeUserForm").style.display = "block";
  }

  closeForm() {
    document.getElementById("TypeUserForm").style.display = "none";
  }


  SavePerson(sub: any, email: any, name: any, address: HTMLElement) {
    var business_check = document.getElementById('yesBusiness') as HTMLInputElement;
    var user_check = document.getElementById('yesUser') as HTMLInputElement;

    function closeForm() {
      document.getElementById("TypeUserForm").style.display = "none";
    }


    if (business_check.checked) {
      this.SaveBusiness(sub);
      closeForm();
      console.log("business checked, close from")
    } else if (user_check.checked) {
      this.SaveUser(sub,email,name);
      closeForm();
      console.log("user checked, close from")
    }

  }

  updateName(event: any) {
    this.business.business_name = event.target.value;
  }


  updateType(event: any) {
    this.business.business_type = event.target.value;
  }

  updateAddress(event: any) {
    this.business.business_address = event.target.value;
    this.Business_geocode()
  }


  updateDescription(event: any) {
    this.business.business_description = event.target.value;
  }


  SaveBusiness(sub:string) {
    this.business.business_id = sub.replace(/\|/g, "");
    this.business.business_coordinates = document.getElementById('Business_geometry').innerText;
    this.business.business_county = document.getElementById('Business_county').innerText;
    this.business.business_town= document.getElementById('Business_town').innerText;
    this.business.business_footprint = '500';
    this.business.business_level = 5;
    this.businessesApi
      .saveBusiness(this.business)
      .subscribe(
        () => this.router.navigate(['/feed']),
        error => alert(error.message)
      );

  }

  updateUserAddress(event: any) {
    this.user.user_address = event.target.value;
    this.User_geocode()
  }

  updateUserName(event: any) {
    this.user.user_name = event.target.value;

  }

  SaveUser(sub: string, email: any, name: any) {

    this.user.user_id = sub.replace(/\|/g, "");
    this.user.user_email = email;
    this.user.user_coordinates = document.getElementById('User_geometry').innerText;
    this.user.user_footprint = '437';
    this.user.user_level = 4;
    this.usersApi
      .saveUser(this.user)
      .subscribe(
        () => this.router.navigate(['/feed']),
        error => alert(error.message)
      );

  }






Business_geocode(){

    var location = (<HTMLInputElement>document.getElementById('Business_Address')).value;

    function extractFromAddress(components, type) {
      return components.filter((component) => component.types.indexOf(type) === 0).map((item) => item.long_name).pop() || null;

  }

  axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
      params:{
        address:location,
        key:'AIzaSyAtQd15O88p-QTIGHwkP1hq554j8PwPJMc'
      }
    })
      .then(function(response){
        // Log full response
        console.log(response);

        // Formatted Address
        var formattedAddress = response.data.results[0].formatted_address;
        console.log("the returned formatted address is " + formattedAddress);
        var formattedAddressOutput = `
          <ul class="list-group">
            <li class="list-group-item">${formattedAddress}</li>
          </ul>
        `;


        // Address Components
        var addressComponents = response.data.results[0].address_components;

        const postal_town= extractFromAddress(addressComponents, "postal_town");
        console.log("this is the town" +postal_town);
        var postal_town_Output = ` <p>${postal_town} </p> `;

        const county= extractFromAddress(addressComponents, "administrative_area_level_1");
        console.log("this is the county" +county);
        var  county_Output = ` <p>${county} </p> `;


        // Geometry
        var lat = response.data.results[0].geometry.location.lat;
        var lng = response.data.results[0].geometry.location.lng;
        var geometryOutput = ` <p>${lat} ${lng} </p> `;

        document.getElementById('Business_county').innerHTML= county_Output;
        document.getElementById('Business_town').innerHTML = postal_town_Output;
        document.getElementById('Business_geometry').innerHTML = geometryOutput;

        console.log(geometryOutput);
      })
      .catch(function(error){
        console.log(error);
      });
  }



  User_geocode(){

    var location = (<HTMLInputElement>document.getElementById('User_Address')).value;

    axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
      params:{
        address:location,
        key:'AIzaSyAtQd15O88p-QTIGHwkP1hq554j8PwPJMc'
      }
    })
      .then(function(response){
        // Log full response
        console.log(response);


        // Geometry
        var lat = response.data.results[0].geometry.location.lat;
        var lng = response.data.results[0].geometry.location.lng;
        var geometryOutput = `<p>${lat} ${lng} </p>`;

        document.getElementById('User_geometry').innerHTML = geometryOutput;
      })
      .catch(function(error){
        console.log(error);
      });
  }




   FootprintAnimate()
  {

    var Donations=0;
    let heartPath = document.getElementById("heartPath") as unknown as  SVGAElement;
    let heartRect = document.getElementById("heartRect") as unknown as  SVGAElement;
        var footprint = this.user.user_footprint;
        var percent = parseInt(footprint)/10;
        console.log("percent is "  + percent);
        heartRect.setAttribute("y",String(percent))
  }


  getTrophies() {
    var level = this.user.user_level;
    for (var x = 1; x <21; x++) {
      this.trophies.push({
        name: 'Trophy ' + ' '  + x,
        description: 'Reach Level ' + ' ' + x,
        dateEarned: this.user.user_level >= x ? new Date(): null
      })
    }

  }


  FootprintAnimate2()
  {

    var Donations=0;
    let heartPath2 = document.getElementById("heartPath2") as unknown as  SVGAElement;
    let heartRect2 = document.getElementById("heartRect2") as unknown as  SVGAElement;
    var footprint = this.business.business_footprint;
    var percent = parseInt(footprint)/10;
    console.log("percent is "  + percent);
    heartRect2.setAttribute("y",String(percent))
  }


  getTrophies2() {
    var level = this.business.business_level;
    //debugger;
    for (var x = 0; x <21; x++) {
      this.trophies.push({
        name: 'HaveTrophy' + x,
        description: 'Description for trophy ' + x,
        dateEarned: this.business.business_level >= x ? new Date(): null
      })
    }

  }


}


