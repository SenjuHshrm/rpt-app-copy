import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as jwt_decode from 'jwt-decode';

@Injectable({
	providedIn: 'root'
})

export class landAsmtPending {

	constructor(private http: HttpClient) { }

	getEncoder() {
		let token = jwt_decode(localStorage.getItem('auth'));
		return token.name;
	}

	getPending(data: string): Observable<any> {
		let encoder = {
			name: this.getEncoder()
		};
		let httpUrl: string = '';
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + localStorage.getItem('auth')
		});
		switch(data) {
			case 'SUBDIVISION (SD)':
				httpUrl = 'http://192.168.100.24:5000/api/pending/subdivision';
				break;
			case 'SEGREGATION (SG)':
				httpUrl = 'http://192.168.100.24:5000/api/pending/segregation';
				break;
			case 'CONSOLIDATION (CS)':
				httpUrl = 'http://192.168.100.24:5000/api/pending/consolidation';
				break;
		}
		let opt = { headers: headers };
		return this.http.post(httpUrl, encoder, opt);
	}

}
