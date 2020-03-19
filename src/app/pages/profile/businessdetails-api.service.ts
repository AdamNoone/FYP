import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {API_URL} from 'src/app/env';
import {Business} from './business.model';

@Injectable()
export class BusinessApiService {
  private id: any;

  constructor(private http: HttpClient) {
  }

  private static _handleError(err: HttpErrorResponse | any) {
    return Observable.throw(err.message || 'Error: Unable to complete request.');
  }

  // GET list of public, future events
  private BusinessesUrl = `${API_URL}/businesses`;



  getBusinesses(): Observable<Business[]> {
    return this.http
      .get< Business[] >(`${API_URL}/businesses`)
      .catch(BusinessApiService._handleError);
  }

  /** GET business by business_id. Will 404 if id not found */
  getBusinessbyBusinessID(business_id: string): Observable<Business> {
    let businesses = this.http.get<Business>(`${this.BusinessesUrl}/${business_id}`);
    console.log(businesses[business_id]);
    return businesses ;
  }

  saveBusiness(business: { business_name: string; business_address: string; business_type: string; business_description: string; business_id: string; business_coordinates: string }): Observable<any> {
    return this.http
      .post(`${API_URL}/businesses`, business);
  }
}

