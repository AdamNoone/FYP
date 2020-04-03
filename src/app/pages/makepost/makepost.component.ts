import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PostsApiService} from '../feed/posts-api.service';
import {AuthService} from 'src/app/auth/auth.service';
import {map, takeUntil} from "rxjs/operators";
import {FoodApiService} from "./food-api.service";
import {Food} from "./food.model";
import {Observable, ReplaySubject, Subject} from "rxjs";
import {FormGroup} from "@angular/forms"
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ModalComponent} from "../../components/modal/modal.component";
import {BusinessApiService} from "../profile/businessdetails-api.service";

@Component({
  selector: 'app-makepost',
  templateUrl: './makepost.component.html',
  styleUrls: ['./makepost.component.css']
})


export class MakepostComponent implements OnInit {
  post = {
    title: '',
    description: '',
    picture: '',
    business: '',
    business_address:'',
    business_name: '',
    ingredients:'',
    carbon_footprint: 0,
    portion: 0,
    price:'',
    collection_time:'',
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

  profileJson: string = null;
  validatingForm: FormGroup;
  private destroyed$ = new Subject<void>();
  private foods$ = new ReplaySubject<Food[]>();

  ingredientSearch: string = '';
  food_name: any;
  public canvasWidth = 270;
  public needleValue: number = 0;
  public centralLabel = '';
  public name = '';
  //public bottomLabel :
  public options = {
    hasNeedle: true,
    needleColor: 'gray',
    needleUpdateSpeed: 2000,
    arcColors: ['rgb(179,255,180)','rgb(119,222,110)','rgb(65,222,15)'],
    arcDelimiters: [30,70],
    rangeLabel: ['Good', 'Great'],
    needleStartValue: 0,
  };

  constructor(private FoodService: FoodApiService, private BusinessService: BusinessApiService, private postsApi: PostsApiService, private router: Router, public auth: AuthService, public matDialog: MatDialog) {
  }

  ngOnInit() {
    this.getFoods();
    this.auth.userProfile$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(
      profile => {
        this.profileJson = JSON.stringify(profile, null, 2)
        this.getBusinessbyBusinessID(profile.sub.replace (/\|/g, ""));
      }
    );

    //console.log("hello",this.profileJson);
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "350px";
    dialogConfig.width = "600px";
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);
  }



  updateTitle(event: any) {
    this.post.title = event.target.value;
  }

  updateDescription(event: any) {
    this.post.description = event.target.value;
  }

  updatePrice(event: any) {
    this.post.price = event.target.value;
  }

  updateTime(event: any) {
    this.post.collection_time = event.target.value;
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
          let picture_src = document.getElementById('base64').innerHTML;
         let picture = (<HTMLImageElement>document.getElementById("post_pic"))
          picture.src = picture_src
        }


      };
    }
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

  updatePortion(event: any) {
    this.post.portion = event.target.value;
  }

  SavePost(sub: string) {
    this.post.ingredients= this.updateIngredients();
    this.post.carbon_footprint= parseFloat(document.getElementById('val').innerHTML);
    this.post.picture = document.getElementById('base64').innerHTML;
    this.postsApi
      .savePost(this.post)
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
        this.post.business = this.business.business_id;
        this.post.business_name = this.business.business_name;
        this.post.business_address = this.business.business_address;
      });
  }

  getFoods(): void {
    this.FoodService.getFoods().pipe(
      takeUntil(this.destroyed$)
    ).subscribe(foods => this.foods$.next(foods));
  }

  getIngredientSearch(): Observable<Food[]> {
    return this.foods$.pipe(
      map(ingredients => ingredients.filter(i => i.food_name.includes(this.ingredientSearch) ||
        i.food_name.includes(this.ingredientSearch[0].toUpperCase() + this.ingredientSearch.slice(1)) ||
        i.food_name.includes(this.ingredientSearch[0].toLowerCase() + this.ingredientSearch.slice(1)))
      )
  );
  }


  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }


  InsertIngredient(name: string, cf: string) {

    let tableRef = document.getElementById("Chosen_InIngredients") as HTMLTableElement;

    // Insert a row at the end of the table
    let newRow = tableRef.insertRow(-1);
    newRow.style.textAlign = "center";

    // Insert a cell in the row at index 0
    let newCellFood = newRow.insertCell(0);
    let newCellCF = newRow.insertCell(1);

    // Append a text node to the cell
    let newFoodText = document.createTextNode(name);
    let newCFText = document.createTextNode(cf);
    newCellFood.appendChild(newFoodText);
    newCellCF.appendChild(newCFText);

    this.SumOfFootprint()
    this.updateIngredients();
  }


  SumOfFootprint() {
    var table = document.getElementById("Chosen_InIngredients") as HTMLTableElement, sumVal = 0;

    for (var i = 1; i < table.rows.length; i++) {
      sumVal = sumVal + parseFloat(table.rows[i].cells[1].innerHTML);
    }

    sumVal = Math.round(sumVal * 10) / 10;
    document.getElementById("val").innerHTML =  String(sumVal);
    console.log(sumVal);
  this.needleValue = sumVal;

  }


}
