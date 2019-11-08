import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import config from '../default/config';
@Injectable({
   providedIn: 'root'
})

export class getClFile {
   constructor(private http: HttpClient) { }
   getFile(data: any): Observable<any> {
      let headers = new HttpHeaders({
         'Content-Type': 'application/json',
         'Authorization': 'Bearer ' + localStorage.getItem('auth')
      });
      let opt = { headers: headers };
      return this.http.post(config.api + '/api/get-file/land-tax', data, opt);
   }
}
