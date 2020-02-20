import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/auth/auth.service';
import {BusinessApiService} from 'src/app/pages/profile/businessdetails-api.service';
import {UserApiService} from 'src/app/pages/profile/userdetails-api.service';
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




  SavePerson(sub: any, email: any, name: any) {
    var business_check = document.getElementById('yesBusiness') as HTMLInputElement;
    var user_check = document.getElementById('yesUser') as HTMLInputElement;

    function closeForm() {
      document.getElementById("TypeUserForm").style.display = "none";
    }


    if (business_check.checked) {
      this.SaveBusiness(sub);
    } else if (user_check.checked) {
      this.SaveUser(sub,email,name)
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
  }


  updateDescription(event: any) {
    this.business.business_description = event.target.value;
  }


  SaveBusiness(sub:string) {
    this.business.business_id = sub.replace(/\|/g, "");
    this.business.business_coordinates = '53.3371633,-6.2675127';
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
    this.user.user_coordinates = '53.3371633,-6.2675127';
    this.user.user_footprint = '0';
    this.usersApi
      .saveUser(this.user)
      .subscribe(
        () => this.router.navigate(['/feed']),
        error => alert(error.message)
      );

  }



}
