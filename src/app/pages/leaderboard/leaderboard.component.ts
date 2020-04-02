import { Component, OnInit } from '@angular/core';
import {BusinessApiService} from 'src/app/pages/profile/businessdetails-api.service';
import {Subscription} from "rxjs";
import {AuthService} from "../../auth/auth.service";
import {Business} from "../profile/business.model";
import {UserApiService} from 'src/app/pages/profile/userdetails-api.service';
import {User} from "../profile/user.model";

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  BusinessesListSubs: Subscription;
  BusinessesList: Business[];
  UsersListSubs: Subscription;
  UsersList: User[];

  constructor(private businessesApi: BusinessApiService,public auth: AuthService,private usersApi: UserApiService ) { }

  ngOnInit(): void {
    this.BusinessesListSubs = this.businessesApi
    .getBusinesses()
    .subscribe(res => {
        this.BusinessesList = res;
        this.Business_leaderboard(res)
      },
      console.error
    );

    this.UsersListSubs = this.usersApi
      .getUsers()
      .subscribe(res2 => {
          this.UsersList = res2;
          this.User_leaderboard(res2)
        },
        console.error
      );
  }

  Business_leaderboard(res: Business[]) {
    var leaderboard = document.getElementById('Business_leaderboard');
    var tbody = leaderboard.querySelector('tbody');
    var tbodyHtml = '';


    res.sort(function(a,b) {
      return Number(b.business_footprint) - Number(a.business_footprint);
    });

    var i =1;
    for (var bus of res) {

      tbodyHtml += '<tr><td>' + i + '</td><td>' + bus.business_name + '</td><td>' + bus.business_footprint+ '</td></tr>';
      i=i+1
    }

    tbody.innerHTML = tbodyHtml;
  }


  User_leaderboard(res2: User[]) {
    var leaderboard = document.getElementById('User_leaderboard');
    var tbody2 = leaderboard.querySelector('tbody');
    var tbodyHtml2 = '';


    res2.sort(function(a,b) {
      return Number(b.user_footprint) - Number(a.user_footprint);
    });

    var i =1;
    for (var user of res2) {
      var x = user.user_footprint;
      parseFloat(x);
      var z =Number(x);
      var y = Math.round((z + Number.EPSILON) * 100) / 100
      tbodyHtml2 += '<tr><td>' + i + '</td><td>' + user.user_name + '</td><td>' + y+ '</td></tr>';
      i=i+1
    }

    tbody2.innerHTML = tbodyHtml2;
    tbody2.style.border= "2px solid black"

  }

  BusinessbtnClick() {
    let y =document.getElementById("User_leaderboard")
    y.style.display = "none"
   let x =document.getElementById("Business_leaderboard")
    x.style.display = "block"


  }

  UserbtnClick() {
    let x =document.getElementById("Business_leaderboard")
    x.style.display = "none"
    let y =document.getElementById("User_leaderboard")
    y.style.display = "block"
  }
}


