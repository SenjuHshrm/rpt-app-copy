import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from '../default/config';

@Injectable({
  providedIn: 'root'
})

export class getBldgVals {

  constructor(private http: HttpClient) { }

  getVals(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('auth')
    }),
      opt = { headers: headers };
    return this.http.get(config.api + '/api/get-bldg-vals', opt);
  }

}
