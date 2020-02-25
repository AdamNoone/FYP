import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {API_URL} from 'src/app/env';
import {Post} from './post.model';
import {Business} from "../profile/business.model";

import {of} from "rxjs";
import {map, catchError, tap} from 'rxjs/operators';


@Injectable()
export class PostsApiService {

  constructor(private http: HttpClient) {
  }

  private static _handleError(err: HttpErrorResponse | any) {
    return Observable.throw(err.message || 'Error: Unable to complete request.');
  }

  // GET list of public, future events
  private postsUrl = `${API_URL}/feed`;
  private BusinessesUrl = `${API_URL}/businesses`;


  //old function
  /* getPosts(): Observable<Post[]> {
    return this.http
      .get<Post[]>(`${API_URL}/feed`)
      .catch(PostsApiService._handleError);
  }*/

  /** GET posts from the server */
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl);
  }

  /** GET post by id. Will 404 if id not found */
  getPostbyID(id: number): Observable<Post> {
    let posts = this.http.get<Post>(`${this.postsUrl}/${id}`);
   console.log(posts[id]);
   return posts;
  }



  savePost(post: Post): Observable<any> {
    return this.http
      .post(`${API_URL}/feed`, post);
  }
}
