import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class searchRec {
  constructor(private http: HttpClient) { }

  search(data: any): Observable<any> {
    let headers = new HttpHeaders({
			'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('auth')
    })
    let opt = { headers: headers };
		let searchIn = encodeURI(data.SearchIn),
				searchBy = data.SearchBy,
				info = encodeURI(data.info),
				sysCaller = data.sysCaller,
				URI = 'http://192.168.100.24:5000/api/search-faas-record/' + sysCaller + '/' + searchIn + '/' + searchBy + '/' + info;
    return this.http.get(URI, opt);
  }
}
