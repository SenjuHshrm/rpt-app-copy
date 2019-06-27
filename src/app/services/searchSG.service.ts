import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
      return this.http.post('http://192.168.100.24:5000/api/segregation/get-data', data, opt);
   }
}