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
    //this.FootprintAnimate();

  }



  get_userbyUserID(user_id: string): void {
    this.usersApi.get_userbyUserID(user_id)
      .subscribe(user=> {
        this.user = user
        this.getTrophies()
        this.FootprintAnimate()
      });
  }


/*editUser(user_id: string, changes: Partial<User>) {

  this.user.subscribe(user => {
    const oldUser = user.filter(u => u.user_id == user_id)[0];
    const newUser = {
      ...oldUser,
      ...changes
    };

    this.user.next([...foods, ingredient])
  })
}*/

  openForm() {
    document.getElementById("TypeUserForm").style.display = "block";
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
    //console.log(document.getElementById('Business_geometry').innerText);
    this.business.business_coordinates = document.getElementById('Business_geometry').innerText;
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

  SaveUser(sub: string, email: any, name: any) {

    this.user.user_id = sub.replace(/\|/g, "");
    this.user.user_email = email;
    this.user.user_name = name;
    this.user.user_coordinates = document.getElementById('User_geometry').innerText;
    this.user.user_footprint = '500';
    this.user.user_level = 5;
    this.usersApi
      .saveUser(this.user)
      .subscribe(
        () => this.router.navigate(['/feed']),
        error => alert(error.message)
      );

  }






Business_geocode(){

    var location = (<HTMLInputElement>document.getElementById('Business_Address')).value;

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
        var geometryOutput = ` <p>${lat} ${lng} </p> `;

        document.getElementById('Business_geometry').innerHTML = geometryOutput;
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
    debugger;
    for (var x = 0; x <11; x++) {
      this.trophies.push({
        name: 'HaveTrophy' + x,
        description: 'Description for trophy ' + x,
        dateEarned: this.user.user_level >= x ? new Date(): null
      })
    }

  }


}
