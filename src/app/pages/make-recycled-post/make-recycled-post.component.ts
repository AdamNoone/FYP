import { Component, OnInit, Input,AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {Post} from 'src/app/pages/feed/post.model';
import {ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';

import {PostsApiService} from 'src/app/pages/feed/posts-api.service';
import {map, takeUntil, tap} from "rxjs/operators";
import {BusinessApiService} from "../../pages/profile/businessdetails-api.service";
import {Business} from "../../pages/profile/business.model";
import {} from 'googlemaps';
import {Observable, ReplaySubject, Subject} from "rxjs";
import {Food} from "../makepost/food.model";
import {FoodApiService} from "../makepost/food-api.service";
import {AuthService} from "../../auth/auth.service";
import {RecyclepostApiService} from "./recyclepost-api.service";
import {readTsconfig} from "@angular-devkit/build-angular/src/angular-cli-files/utilities/read-tsconfig";

@Component({
  selector: 'app-make-recycled-post',
  templateUrl: './make-recycled-post.component.html',
  styleUrls: ['./make-recycled-post.component.css']
})
export class MakeRecycledPostComponent implements OnInit, AfterViewInit {
  newpost = {
    title: '',
    description: '',
    picture: '',
    business: '',
    ingredients: '',
    carbon_footprint: 0,
    portion: 0,
  };

  @ViewChild('mapWrapper', {static: false}) mapElement: ElementRef;
  @Input() post: Post;
  @Input() business: Business;

  profileJson: string = null;

  private destroyed$ = new Subject<void>();
  private foods$ = new ReplaySubject<Food[]>();

  ingredientSearch: string = '';
  food_name: any;
  public canvasWidth = 300;
  public needleValue: number = 0;
  public centralLabel = '';
  public name = 'Gauge chart';
  public bottomLabel :number = 0;location: any;

  public options = {
    hasNeedle: true,
    needleColor: 'gray',
    needleUpdateSpeed: 2500,
    arcColors: ['rgb(179,255,180)','rgb(119,222,110)','rgb(65,222,15)'],
    arcDelimiters: [30,70],
    rangeLabel: ['Good', 'Great'],
    needleStartValue: 0,
  };
  constructor(
    private route: ActivatedRoute,
    private postService: PostsApiService,
    private BusinessService: BusinessApiService,
    private FoodService: FoodApiService,
    private postsApi: PostsApiService,
    private recycleApi: RecyclepostApiService,
    private router: Router,
    public auth: AuthService) {

  }

  ngOnInit(): void {
    this.getPost();
    this.getFoods();
    this.auth.userProfile$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(
      profile => this.profileJson = JSON.stringify(profile, null, 2)
    );
    this.createTable();
  }

  ngAfterViewInit() {

    //this.initializeMap();
  }


  updateTitle(event: any) {
    this.newpost.title = event.target.value;
  }

  updateDescription(event: any) {
    this.newpost.description = event.target.value;
  }

  updatePicture() {
    const files = (<HTMLInputElement>document.getElementById('file')).files;
    if (files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = function () {
        console.log(reader.result);
        if (typeof reader.result === "string") {
          document.getElementById('base64').innerHTML = reader.result;
        }


      };
    }
  }

  updateIngredients(){
    var table = document.getElementById("Chosen_InIngredients") as HTMLTableElement;
    let c =0;
    let ingredients_String = table.rows[2].cells[0].innerHTML;
    // console.log("this is the 1st ingredient " + ingredients_String);
    //console.log(table.rows[0].cells[1].innerHTML);
    for (c = 3; c < table.rows.length ; c++) {
      //iterate through rows
      //rows would be accessed using the "row" variable assigned in the for loop
      let EachIngredient = table.rows[c].cells[0].innerHTML;
      // console.log("each Ingredient is " +EachIngredient);
      ingredients_String = ingredients_String + "," + EachIngredient ;
      //iterate through columns
      //columns would be accessed using the "col" variable assigned in the for loop
      console.log(parseFloat(document.getElementById('val').innerHTML));
    }
    //console.log("this is the ingredients string " +ingredients_String);
    return ingredients_String;
  }








  ///ON TRYING TO POPULATE TABLE WITH INGREDIENTS
  createTable() {
    var table = document.getElementById("Chosen_InIngredients")[0] as HTMLTableElement;
    let c = 0;
    let ingredients_String = this.post.ingredients;
    console.log(ingredients_String);
    var result;
    result = ingredients_String.split(",");
    console.log(result);
    // console.log("this is the 1st ingredient " + ingredients_String);
    //console.log(table.rows[0].cells[1].innerHTML);
    for (c = 0; c < result.length; c++) {
      //iterate through rows
      //rows would be accessed using the "row" variable assigned in the for loop
      var newRow   = table.insertRow(table.rows.length);
      var newCell  = newRow.insertCell(0);
      var newText  = document.createTextNode(result[c]);
      newCell.appendChild(newText);
    }
  }













  updatePortion(event: any) {
    this.newpost.portion = event.target.value;
  }

  SavePost(sub: string) {
    this.newpost.ingredients= this.updateIngredients();
    this.newpost.carbon_footprint= parseFloat(document.getElementById('val').innerHTML);
    this.newpost.picture = document.getElementById('base64').innerHTML;
    this.newpost.business = sub.replace(/\|/g, "");
    this.postsApi
      .savePost(this.newpost)
      .subscribe(
        () => this.router.navigate(['/feed']),
        error => alert(error.message)
      );

  }


  getPost(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.postService.getPostbyID(id)
      .subscribe(post=> this.post = post);
  }

  goBack(): void {
    this.location.back();
  }

  getFoods(): void {
    this.FoodService.getFoods().pipe(
      takeUntil(this.destroyed$)
    ).subscribe(foods => this.foods$.next(foods));
  }

  getIngredientSearch(): Observable<Food[]> {
    const foodsObservable = this.foods$.pipe(
      map(ingredients => ingredients.filter(i => i.food_name.includes(this.ingredientSearch)))
    );
    return foodsObservable;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }


  InsertIngredient(name: string, cf: string) {

    let tableRef = document.getElementById("Chosen_InIngredients") as HTMLTableElement;

    // Insert a row at the end of the table
    let newRow = tableRef.insertRow(-1);

    // Insert a cell in the row at index 0
    let newCellFood = newRow.insertCell(0);
    let newCellCF = newRow.insertCell(1);

    // Append a text node to the cell
    let newFoodText = document.createTextNode(name);
    let newCFText = document.createTextNode(cf);
    newCellFood.appendChild(newFoodText);
    newCellCF.appendChild(newCFText);

    this.SumOfFootprint();
    this.updateIngredients();
  }


  SumOfFootprint() {
    var table = document.getElementById("Chosen_InIngredients") as HTMLTableElement, sumVal = 0;

    for (var i = 2; i < table.rows.length; i++) {
      sumVal = sumVal + parseFloat(table.rows[i].cells[1].innerHTML);
    }

    sumVal = Math.round(sumVal * 10) / 10;
    document.getElementById("val").innerHTML = String(sumVal);
    console.log(sumVal);
    this.needleValue = sumVal;
    this.bottomLabel = sumVal;

  }



}


