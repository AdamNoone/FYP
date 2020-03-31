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
    business_address:'',
    business_name: '',
    ingredients: '',
    carbon_footprint: 0,
    portion: 0,
    price:'',
    collection_time:'',
  };

  post2 = {
    title: '',
    description: '',
    picture: '',
    business: '',
    business_address:'',
    business_name: '',
    ingredients: '',
    carbon_footprint: 0,
    portion: 0,
    price:'',
    collection_time:'',
  };

  food: Food = {
    food_name: '',
    food_group: '',
    food_cf: '',

  };


  business = {
    business_id : '',
    business_name: '',
    business_type : '',
    business_address: '',
    business_coordinates: '',
    business_description: '',
    business_footprint: '',
    business_level: 0,
    business_county: '',
    business_town: '',
  };

  @ViewChild('mapWrapper', {static: false}) mapElement: ElementRef;
  profileJson: string = null;

  private destroyed$ = new Subject<void>();
  private foods$ = new ReplaySubject<Food[]>();

  ingredientSearch: string = '';
  food_name: any;
  public canvasWidth = 300;
  public needleValue: number = 0;
  public centralLabel = '';
  public name = 'Gauge chart';
  public bottomLabel :number = this.post.carbon_footprint;

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
      profile => {
        this.profileJson = JSON.stringify(profile, null, 2)
        this.getBusinessbyBusinessID(profile.sub.replace(/\|/g, ""));
      });
  }

  ngAfterViewInit() {

  }


  updateTitle() {
    return (this.post2.title = (<HTMLInputElement>document.getElementById("post-title")).value);
  }

  updateDescription() {
    return (this.post2.description = (<HTMLInputElement>document.getElementById("post-description")).value);
  }

  updatePicture() {
    return (this.post2.description = (<HTMLInputElement>document.getElementById(" base64")).value);
  }

  updatePrice() {
    return (this.post2.price = (<HTMLInputElement>document.getElementById("post-price")).value);
  }

  updateTime() {
    return (this.post2.collection_time = (<HTMLInputElement>document.getElementById("post-time")).value);
  }

  updateIngredients(){
    var table = document.getElementById("Chosen_InIngredients") as HTMLTableElement;
    let c =0;
    let ingredients_String = table.rows[2].cells[0].innerHTML + "/" + table.rows[2].cells[1].innerHTML;
    // console.log("this is the 1st ingredient " + ingredients_String);
    //console.log(table.rows[0].cells[1].innerHTML);
    for (c = 3; c < table.rows.length ; c++) {
      //iterate through rows
      //rows would be accessed using the "row" variable assigned in the for loop
      let EachIngredient = table.rows[c].cells[0].innerHTML;
      let EachCF = table.rows[c].cells[1].innerHTML;
      // console.log("each Ingredient is " +EachIngredient);
      ingredients_String = ingredients_String + "," + EachIngredient + "/" + EachCF ;
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


  updatePortion() {
   return (this.post2.portion = parseInt((<HTMLInputElement>document.getElementById("post-portion")).value));
  }

  SavePost(sub: string) {
    this.post2.title = this.updateTitle();
    this.post2.description = this.updateDescription();
    this.post2.portion = this.updatePortion();
    this.post2.ingredients= this.updateIngredients();
    this.post2.price = this.updatePrice();
    this.post2.collection_time = this.updateTime();
    this.post2.carbon_footprint= parseFloat(document.getElementById('val').innerHTML);
    this.post2.picture = this.post.picture;
    this.post2.business = sub.replace(/\|/g, "");
    this.postsApi
      .savePost(this.post2)
      .subscribe(
        () => this.router.navigate(['/feed']),
        error => alert(error.message)
      );

    this.BusinessService.UpdateBusiness(this.business.business_id, String(this.post.carbon_footprint))
      .subscribe(post=> this.post);

  }


  getBusinessbyBusinessID(business_id: string) {

    this.BusinessService.getBusinessbyBusinessID(business_id)
      .subscribe(business=> {
        this.business = business;
        this.post2.business = this.business.business_id;
        this.post2.business_name = this.business.business_name;
        this.post2.business_address = this.business.business_address;
      });
  }

  get_foodbyname(name): any {
    this.recycleApi.get_foodbyname(name)
      .subscribe(food=> this.food = food)

  }


  getPost(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.postsApi.getPostbyID(id)
      .subscribe(post=> {
        this.post = post;
        this.createTable();
        //this.options.needleStartValue = this.post.carbon_footprint;
        this.needleValue = this.post.carbon_footprint;
        this.bottomLabel = this.post.carbon_footprint;})

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


