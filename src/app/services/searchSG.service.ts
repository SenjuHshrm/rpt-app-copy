import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import config from '../default/config'
@Injectable({
   providedIn: 'root'
})
export class searchSG {

   constructor(private http: HttpClient) { }

   search(data: any): Observable<any> {
      let headers = new HttpHeaders({
         'Content-Type': 'application/json',
         'Authorization': 'Bearer ' + localStorage.getItem('auth')
      });
      let opt = { headers: headers };
      return this.http.post(config.api + '/api/segregation/get-data', data, opt);
   }
}
