import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from '../default/config';
@Injectable({
	providedIn: 'root'
})

export class reassessments {

	constructor(private http: HttpClient) { }

	private setReqHeaders() {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + localStorage.getItem('auth')
		})
		return { headers: headers }
	}

	public reassessLand(data: any): Observable<any> {
		return this.http.put(config.api + '/api/land-reasmt/reassess', data, this.setReqHeaders())
	}

	public reassessBldg(data: any): Observable<any> {
		return this.http.put(config.api + '/api/bldg-reasmt/reassess', data, this.setReqHeaders())
	}

}
