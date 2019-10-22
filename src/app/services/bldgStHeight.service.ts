import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class bldgStHeight {
    constructor(private http: HttpClient) { }

    public getVal(): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('auth')
        }),
        opt = { headers: headers }
        return this.http.get('http://192.168.100.24:5000/api/get-bldg-heights', opt);
    }
    
}