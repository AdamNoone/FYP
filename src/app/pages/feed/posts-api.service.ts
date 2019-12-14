import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {API_URL} from 'src/app/env';
import {Post} from './post.model';

@Injectable()
export class PostsApiService {

  constructor(private http: HttpClient) {
  }

  private static _handleError(err: HttpErrorResponse | any) {
    return Observable.throw(err.message || 'Error: Unable to complete request.');
  }

  // GET list of public, future events



  getPosts(): Observable<Post[]> {
    return this.http
      .get< Post[] >(`${API_URL}/feed`)
      .catch(PostsApiService._handleError);
  }

  savePost(post: Post): Observable<any> {
    return this.http
      .post(`${API_URL}/feed`, post);
  }
}

