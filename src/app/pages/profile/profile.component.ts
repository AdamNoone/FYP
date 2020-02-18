import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import {BusinessApiService} from 'src/app/pages/profile/userdetails-api.service';
import {Business} from 'src/app/pages/profile/business.model';
import {PostsApiService} from "../feed/posts-api.service";
import {Router} from "@angular/router";

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

  constructor(public auth: AuthService, private businessesApi: BusinessApiService, private router: Router) {
  }

  ngOnInit() {
    this.auth.userProfile$.subscribe(
      profile => this.profileJson = JSON.stringify(profile, null, 2)
    );
   // console.log(this.profileJson);
    var str = this.profileJson;
    let n = str.slice(303, 307);
    if (n === "fals") {
      this.openForm();
    }
  }

  openForm() {
    document.getElementById("TypeUserForm").style.display = "block";
  }


  updateName(event: any) {
    this.business.business_name = event.target.value;
  }


  updateType(event: any) {
    this.business.business_type = event.target.value;
  }

  updateAddress(event: any) {
    this.business.business_address = event.target.value;
  }


  updateDescription(event: any) {
    this.business.business_description = event.target.value;
  }


  SaveBusiness(sub:any) {
    this.business.business_id = sub;
    this.business.business_coordinates = '53.3371633,-6.2675127';
    this.businessesApi
      .saveBusiness(this.business)
      .subscribe(
        () => this.router.navigate(['/feed']),
        error => alert(error.message)
      );

  }

}

