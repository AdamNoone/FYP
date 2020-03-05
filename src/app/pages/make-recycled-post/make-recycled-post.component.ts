import { Component, OnInit, Input,AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {Post} from 'src/app/pages/feed/post.model';
import {ActivatedRoute, Router} from '@angular/router';
import {PostsApiService} from 'src/app/pages/feed/posts-api.service';
import {map, takeUntil, tap} from "rxjs/operators";
import {BusinessApiService} from "../profile/businessdetails-api.service";
import {Business} from "../profile/business.model";
import {Observable, ReplaySubject, Subject} from "rxjs";
import {Food} from "../makepost/food.model";
import {FoodApiService} from "../makepost/food-api.service";
import {AuthService} from "../../auth/auth.service";
import {RecyclepostApiService} from "./recyclepost-api.service";
import {Location } from '@angular/common';

@Component({
  selector: 'app-make-recycled-post',
  templateUrl: './make-recycled-post.component.html',
  styleUrls: ['./make-recycled-post.component.css']
})
export class MakeRecycledPostComponent implements OnInit, AfterViewInit {
  post = {
    title: '',
    description: '',
    picture: '',
    business: '',
    ingredients: '',
    carbon_footprint: 0,
    portion: 0,
  };

  food: Food = {
    food_name: '',
    food_group: '',
    food_cf: '',

  };

  @ViewChild('mapWrapper', {static: false}) mapElement: ElementRef;
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
  public bottomLabel :number = 0;

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
    private BusinessService: BusinessApiService,
    private FoodService: FoodApiService,
    private postsApi: PostsApiService,
    private recycleApi: RecyclepostApiService,
    private router: Router,
    public auth: AuthService,
    private location: Location) {

  }

  ngOnInit(): void {
    this.getPost();
    this.getFoods();
    this.auth.userProfile$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(
      profile => this.profileJson = JSON.stringify(profile, null, 2)
    );
  }

  ngAfterViewInit() {

  }


  updateTitle(event: any) {
    this.post.title = event.target.value;
  }

  updateDescription(event: any) {
    this.post.description = event.target.value;
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



  createTable() {
    var table = document.getElementById("Chosen_InIngredients") as HTMLTableElement;
    let c = 0;
    //let ingredients_String ='Lamb/39.2,Beef/27,Turkey/10.9,Salmon/4.14';
    let ingredients_String = this.post.ingredients;
    console.log("ingredients are" + ingredients_String);
    var result;
    var result2;
    result = ingredients_String.split(",");
    console.log(result);
    // console.log("this is the 1st ingredient " + ingredients_String);
    //console.log(table.rows[0].cells[1].innerHTML);
    for (c = 0; c < result.length; c++) {
      //iterate through rows
      //rows would be accessed using the "row" variable assigned in the for loop
      var newRow   = table.insertRow(table.rows.length);
      var newCell1  = newRow.insertCell(0);
      var newCell2  = newRow.insertCell(1);
      result2 = result[c].split("/");
      console.log("this is the result" + result2);
      var newText1  = document.createTextNode(result2[0]);
      var newText2  = document.createTextNode(result2[1]);
      newCell1.appendChild(newText1);
      newCell2.appendChild(newText2);
    }
  }


  updatePortion(event: any) {
    this.post.portion = event.target.value;
  }

  SavePost(sub: string) {
    this.post.ingredients= this.updateIngredients();
    this.post.carbon_footprint= parseFloat(document.getElementById('val').innerHTML);
    this.post.picture = document.getElementById('base64').innerHTML;
    this.post.business = sub.replace(/\|/g, "");
    this.postsApi
      .savePost(this.post)
      .subscribe(
        () => this.router.navigate(['/feed']),
        error => alert(error.message)
      );

  }

  get_foodbyname(name): any {
    this.recycleApi.get_foodbyname(name)
      .subscribe(food=> this.food = food)

  }


  getPost(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.postsApi.getPostbyID(id)
      .subscribe(post=> {
        this.post = post
        this.createTable()})

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


