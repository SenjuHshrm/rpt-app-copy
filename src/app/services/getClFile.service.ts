import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';

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
      return this.http.post('http://192.168.100.24:5000/api/get-file/land-tax', data, opt);
   }
}