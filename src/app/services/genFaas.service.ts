import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
   providedIn: 'root'
})

export class genFaas {
   
   constructor(private http: HttpClient) { }

   generate(data: any): Observable<any> {
      let headers = new HttpHeaders({
         'Content-Type': 'application/json'
      });
      let opt = { headers: headers };
      return this.http.post('http://192.168.100.24:5000/api/get-land-faas', data, opt);
   }
}