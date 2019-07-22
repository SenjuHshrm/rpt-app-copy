import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
   providedIn: 'root'
})

export class getPosHolders {
   constructor(private http: HttpClient) { }

   getPosHoldersCl(caller: any): Observable<any> {
      let headers = new HttpHeaders({
         'Authorization': 'Bearer ' + localStorage.getItem('auth')
      });
      let opt = { headers: headers }
      return this.http.get('http://192.168.100.24:5000/api/position-holders/' + encodeURI(caller), opt);
   }
}
