import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from '../default/config';
@Injectable({
	providedIn: 'root'
})

export class getMarketValues {

	constructor(private http: HttpClient) { }

	getValues(): Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + localStorage.getItem('auth')
		}),
				opt = { headers: headers };
		return this.http.get(config.api + '/api/land/market-values', opt);
	}

}
