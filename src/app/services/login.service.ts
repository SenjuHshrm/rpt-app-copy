import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credentials } from '../classes/cred';
import config from '../default/config';

@Injectable({
  providedIn: 'root'
})

export class login {
  constructor(private httpClient: HttpClient) { }

  authenticateUser(data: Credentials): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let opt = { headers: headers };
    return this.httpClient.post(config.api + '/api/login', data)
  }

}
