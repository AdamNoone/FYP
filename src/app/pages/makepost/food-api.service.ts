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
    let foods = this.http.get<Food[]>(`${this.FoodUrl}`)
      .catch(FoodApiService._handleError);
    return foods ;
  }

  /** GET food by group. Will 404 if id not found */
  get_foodbygroup(food_group: string): Observable<Food[]> {
    let foods = this.http.get<Food[]>(`${this.FoodUrl}`);
    console.log(foods[food_group]);
    return foods ;
  }

  saveFood(food: { food_group: string; food_name: string; food_cf: number }): Observable<any> {
    return this.http
      .post(`${API_URL}/food`, food);
  }
}

