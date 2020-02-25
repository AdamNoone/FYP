import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-typeofpost',
  templateUrl: './typeofpost.component.html',
  styleUrls: ['./typeofpost.component.css']
})
export class TypeofpostComponent implements OnInit {

  constructor(private router: Router) {

  }

  ngOnInit() {
  }


  RepeatbtnClick() {

      this.router.navigate(['/makepost']);

  }

  NewbtnClick() {

      this.router.navigate(['/makepost']);

  }
}
