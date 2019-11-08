import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import config from '../default/config'
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
      return this.http.get(config.api + '/api/position-holders/' + encodeURI(caller), opt);
   }
}
