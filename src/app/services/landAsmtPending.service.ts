import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import config from '../default/config'
@Injectable({
	providedIn: 'root'
})

export class landAsmtPending {

	constructor(private http: HttpClient) { }

	getEncoder() {
		let token: any = jwt_decode(localStorage.getItem('auth'));
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
				httpUrl = config.api + '/api/pending/subdivision/' + encodeURI(encoder.name);
				break;
			case 'SEGREGATION (SG)':
				httpUrl = config.api + '/api/pending/segregation/' + encodeURI(encoder.name);
				break;
			case 'CONSOLIDATION (CS)':
				httpUrl = config.api + '/api/pending/consolidation/' + encodeURI(encoder.name);
				break;
		}
		let opt = { headers: headers };
		return this.http.get(httpUrl, opt);
	}

}
