import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class setRefNum {

	constructor(private http: HttpClient) { }

	getNum(data: any): Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + localStorage.getItem('auth')
		}),
			opt = { headers: headers };
		return this.http.post('http://192.168.100.24:5000/api/set-ref-num', data, opt);
	}
	
}
