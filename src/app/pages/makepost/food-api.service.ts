import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {API_URL} from 'src/app/env';
import {Food} from './food.model';

@Injectable()
export class FoodApiService {
  private id: any;

  constructor(private http: HttpClient) {
  }

  private static _handleError(err: HttpErrorResponse | any) {
    return Observable.throw(err.message || 'Error: Unable to complete request.');
  }

  // GET list of public, future events
  private FoodUrl = `${API_URL}/food`;



  getFoods(): Observable<Food[]> {
    return this.http
      .get< Food[] >(`${API_URL}/food`)
      .catch(FoodApiService._handleError);
  }

  /** GET business by business_id. Will 404 if id not found */
  get_foodbygroup(food_group: string): Observable<Food[]> {
    let foods = this.http.get<Food[]>(`${this.FoodUrl}/${food_group}`);
    console.log(foods[food_group]);
    return foods ;
  }

  saveFood(food: Food): Observable<any> {
    return this.http
      .post(`${API_URL}/food`, food);
  }
}

