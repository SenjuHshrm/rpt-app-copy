import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from '../default/config';

@Injectable({
   providedIn: 'root'
})

export class fileUpload {
   constructor(private http: HttpClient) {}

   uploadCl(data: any): Observable<any> {
      let headers = new HttpHeaders({
         'Content-Type': 'application/json',
         'Authorization': 'Bearer ' + localStorage.getItem('auth')
      });
      let opt = { headers: headers };
      return this.http.post(config.api + '/api/save/file/clearance', data, opt);
   }
}
