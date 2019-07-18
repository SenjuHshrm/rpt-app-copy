import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})

export class assessLand {

	constructor(private http: HttpClient) { }

	private setReqHeaders() {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + localStorage.getItem('auth')
		})
		return { headers: headers };
	}

	public saveLand(data: any): Observable<any> {
		return this.http.put('http://192.168.100.24:5000/api/land-asmt/add', data, this.setReqHeaders());
	}

	public updateLand(data: any): Observable<any> {
		return this.http.put('http://192.168.100.24:5000/api/land-asmt/update', data, this.setReqHeaders());
	}

}
