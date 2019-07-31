import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class GetBldgValues {

	constructor(private http: HttpClient) {  }

	setHeaders() {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + localStorage.getItem('auth')
		});
		return { headers: headers };
	}

	getKind(): Observable<any> {
		return this.http.get('http://192.168.100.24:5000/api/bldg/kinds', this.setHeaders());
	}

}
