import { Component, OnInit } from '@angular/core';
import { faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/auth/auth.service';
import {BusinessApiService} from 'src/app/pages/profile/businessdetails-api.service';
import {UserApiService} from 'src/app/pages/profile/userdetails-api.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  isCollapsed = true;
  faUser = faUser;
  faPowerOff = faPowerOff;
  private profileJson: string;
  business = null;

  user = {
    user_id : '',
    user_email : '',
    user_name: '',
    user_address: '',
    user_coordinates: '',
    user_footprint: '',
    user_level: 0,
  };

  constructor(public auth: AuthService, private businessesApi: BusinessApiService,private usersApi: UserApiService) { }

  ngOnInit() {

    this.auth.userProfile$.subscribe(
      profile => {
        if(profile) {
        this.profileJson = JSON.stringify(profile, null, 2);

          console.log(this.profileJson);
          var test = JSON.parse(this.profileJson);
          console.log(test);
          var firstLoginKey = "http://localhost:3000/first_login";
          let n = test[firstLoginKey];
          console.log(n);
          var user_id = test.sub.replace(/\|/g, "");
          this.get_userbyUserID(user_id);
          this.getBusinessbyBusinessID(user_id);
        }
      });




  }

  get_userbyUserID(user_id: string) {
    this.usersApi.get_userbyUserID(user_id)
      .subscribe(user=> {
        this.user = user;




      });


  }


  getBusinessbyBusinessID(business_id: string) {
    this.businessesApi.getBusinessbyBusinessID(business_id)
      .subscribe(business=> {
        //debugger
        if(Object.keys(business).length > 0)
        {
          this.business = business;
        }

      });

  }


}
