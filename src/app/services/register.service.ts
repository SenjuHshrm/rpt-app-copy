import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterUser } from '../classes/register';
import config from '../default/config'
@Injectable({
  providedIn: 'root'
})

export class register {

  constructor(private httpClient: HttpClient) { }

  registerNewUser(data: RegisterUser): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    let opt = { headers: headers }
    return this.httpClient.post(config.api + '/api/register', data, opt)
  }
}
