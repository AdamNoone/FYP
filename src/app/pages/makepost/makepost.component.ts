import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PostsApiService} from '../feed/posts-api.service';
import { AuthService } from 'src/app/auth/auth.service';
import {exhaustMap, filter, map, switchMap, takeUntil, tap} from "rxjs/operators";
import {FoodApiService} from "./food-api.service";
import {Food} from "./food.model";
import {Post} from "../feed/post.model";
import {Business} from "../profile/business.model";
import {Observable, ReplaySubject, Subject} from "rxjs";
import { GaugeModule } from 'angular-gauge';

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

  };
  profileJson: string = null;

  private destroyed$ = new Subject<void>();
  private foods$ = new ReplaySubject<Food[]>();

  ingredientSearch: string = '';
  food_name: any;
  public canvasWidth = 300;
  public needleValue: number = 0;
  public centralLabel = '';
  public name = 'Gauge chart';
  public bottomLabel :number = 0;;
  public options = {
    hasNeedle: true,
    needleColor: 'gray',
    needleUpdateSpeed: 1000,
    arcColors: ['rgb(44, 151, 222)', 'lightgray'],
    arcDelimiters: [30],
    rangeLabel: ['0', '100'],
    needleStartValue: 0,
  };

  constructor(private FoodService: FoodApiService, private postsApi: PostsApiService, private router: Router, public auth: AuthService) {
  }

  ngOnInit() {
    this.getFoods();
    this.auth.userProfile$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(
      profile => this.profileJson = JSON.stringify(profile, null, 2)
    );
    //console.log("hello",this.profileJson);
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

  SavePost(sub: string) {
    this.post.picture = document.getElementById('base64').innerHTML;
    this.post.business = sub.replace(/\|/g, "");
    this.postsApi
      .savePost(this.post)
      .subscribe(
        () => this.router.navigate(['/feed']),
        error => alert(error.message)
      );

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


  /*editIngredient(id: number, changes: Partial<Ingredient>) {

    this.foods$.subscribe(foods => {
      const oldFood = foods.filter(f => f.id == id)[0];
      const newFood = {
        ...oldFood,
        ...changes
      };

      this.foods$.next([...foods, ingredient])
    })
  }*/

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

    this.SumOfFootprint()
  }


  SumOfFootprint() {
    var table = document.getElementById("Chosen_InIngredients") as HTMLTableElement, sumVal = 0;

    for (var i = 2; i < table.rows.length; i++) {
      sumVal = sumVal + parseFloat(table.rows[i].cells[1].innerHTML);
    }

    sumVal = Math.round(sumVal * 10) / 10;
    document.getElementById("val").innerHTML = "Sum Value = " + sumVal;
    console.log(sumVal);
  this.needleValue = sumVal;
    this.bottomLabel = sumVal;

  }



}
