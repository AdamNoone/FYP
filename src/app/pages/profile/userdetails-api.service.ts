import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {API_URL} from 'src/app/env';
import {User} from './user.model';
import {Post} from "../feed/post.model";
import {Food} from "../makepost/food.model";

@Injectable()
export class UserApiService {

  constructor(private http: HttpClient) {
  }

  private static _handleError(err: HttpErrorResponse | any) {
    return Observable.throw(err.message || 'Error: Unable to complete request.');
  }

  // GET list of public, future events
  private userUrl = `${API_URL}/users`;
  private updateUrl = `${API_URL}/edit`;


  getUsers(): Observable<User[]> {
    return this.http
      .get< User[] >(`${API_URL}/users`)
      .catch(UserApiService._handleError);
  }


  get_userbyUserID(user_id:string): Observable<User> {
    let users = this.http.get<User>(`${this.userUrl}/${user_id}`);
    console.log(users[user_id]);
    return users;
  }

  UpdateUser(user_id:string,post_footprint:string): Observable<User> {
    let users = this.http.get<User>(`${this.updateUrl}/${user_id}/${post_footprint}`);
    console.log(users[user_id]);
    return users;
  }

    saveUser(user: User): Observable<any> {
    return this.http
      .post(`${API_URL}/users`, user);
  }
}

