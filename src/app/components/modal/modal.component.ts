import {Component, Host, Input, OnInit} from '@angular/core';
import {FoodApiService} from "../../pages/makepost/food-api.service";
import {Router} from "@angular/router";
import {Observable, ReplaySubject, Subject} from "rxjs";
import {MakepostComponent} from "../../pages/makepost/makepost.component";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  private modal: any;
  food = {
    food_name: '',
    food_cf : 0,
    food_group : '',
    updated_by :'',
  };

  @Input() myMethod: Function;


  constructor(private FoodService: FoodApiService,  private router: Router , private postComp: MakepostComponent) { }

  ngOnInit() {
  }

  spanfunction() {
    this.modal = document.getElementById("myModal");
    this.modal.style.display = "none";
    this.postComp.getFoods();
  }

  btnfunction() {
    this.modal = document.getElementById("myModal");
   this.modal.style.display = "block";
  }

  updateFoodname(event: any) {
    this.food.food_name = event.target.value;
  }

  updateFoodGroup(event: any) {

    var ele = document.getElementsByName('type') as unknown as HTMLInputElement;
    var i;
    for(i = 0; i < 8; i++) {
      if(ele[i].checked)


        if (ele[i].value == "Meat")
        {
          this.food.food_cf = parseFloat("19.22");
          this.food.food_group = ele[i].value;
        }

        else if (ele[i].value == "Fish")
        {
          this.food.food_cf = parseFloat("5.12");
          this.food.food_group = ele[i].value;
        }

        else if (ele[i].value == "Starch")
        {
          this.food.food_cf = parseFloat("27.63");
          this.food.food_group = ele[i].value;
        }

        else if (ele[i].value == "Dairy")
        {
          this.food.food_cf = parseFloat("5.60");
          this.food.food_group = ele[i].value;
        }

        else if (ele[i].value == "Fruit")
        {
          this.food.food_cf = parseFloat("0.92");
          this.food.food_group = ele[i].value;
        }

        else if (ele[i].value == "Vegetable")
        {
          this.food.food_cf = parseFloat("2.00");
          this.food.food_group = ele[i].value;
        }

        else if (ele[i].value == "Nuts")
        {
          this.food.food_cf = parseFloat("2.30");
          this.food.food_group = ele[i].value;
        }

        else if (ele[i].value == "Seasoning")
        {
          this.food.food_cf = parseFloat("2.15");
          this.food.food_group = ele[i].value;

        }



    }


  }



  SaveFood() {
    this.food.updated_by  ="admin";
    this.FoodService
      .saveFood(this.food)
      .subscribe(
        () =>  this.spanfunction(),
        error => alert(error.message)


  );

  }



}

