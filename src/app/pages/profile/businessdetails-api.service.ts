import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {API_URL} from 'src/app/env';
import {Business} from './business.model';

@Injectable()
export class BusinessApiService {

  constructor(private http: HttpClient) {
  }

  private static _handleError(err: HttpErrorResponse | any) {
    return Observable.throw(err.message || 'Error: Unable to complete request.');
  }

  // GET list of public, future events



  getBusinesses(): Observable<Business[]> {
    return this.http
      .get< Business[] >(`${API_URL}/businesses`)
      .catch(BusinessApiService._handleError);
  }

  saveBusiness(business: Business): Observable<any> {
    return this.http
      .post(`${API_URL}/businesses`, business);
  }
}

