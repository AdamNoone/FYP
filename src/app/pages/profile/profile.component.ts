import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/auth/auth.service';
import {BusinessApiService} from 'src/app/pages/profile/businessdetails-api.service';
import {UserApiService} from 'src/app/pages/profile/userdetails-api.service';
import {Router} from "@angular/router";
import axios from 'axios';


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
  };

  constructor(public auth: AuthService, private businessesApi: BusinessApiService,private usersApi: UserApiService, private router: Router) {
  }

  ngOnInit() {
    this.auth.userProfile$.subscribe(
      profile => this.profileJson = JSON.stringify(profile, null, 2)
    );
    console.log(this.profileJson);
    var str = this.profileJson;
    let n = str.slice(41, 45);
    console.log(n);
    if (n === "true") {
      this.openForm();
    }
  }

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
    } else if (user_check.checked) {
      this.SaveUser(sub,email,name);
      closeForm();
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
    this.geocode()
  }


  updateDescription(event: any) {
    this.business.business_description = event.target.value;
  }


  SaveBusiness(sub:string) {
    this.business.business_id = sub.replace(/\|/g, "");
    console.log(document.getElementById('geometry').innerText);
    this.business.business_coordinates = document.getElementById('geometry').innerText;
    this.businessesApi
      .saveBusiness(this.business)
      .subscribe(
        () => this.router.navigate(['/feed']),
        error => alert(error.message)
      );

  }

  updateUserAddress(event: any) {
    this.user.user_address = event.target.value;
  }

  SaveUser(sub: string, email: any, name: any) {

    this.user.user_id = sub.replace(/\|/g, "");
    this.user.user_email = email;
    this.user.user_name = name;
    this.user.user_footprint = '0';
    this.usersApi
      .saveUser(this.user)
      .subscribe(
        () => this.router.navigate(['/feed']),
        error => alert(error.message)
      );


  }




  geocode(){

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
        var geometryOutput = `
          <p>${lat} ${lng} </p>
        `;

        document.getElementById('geometry').innerHTML = geometryOutput;
      })
      .catch(function(error){
        console.log(error);
      });
  }
}

