import { Router } from '@angular/router';
import { Injectable } from '@angular/core'
import { loginAuthRes } from '../classes/login'
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class SetAuthRoute {
  constructor(
    private router: Router
  ) {}

  storeToken(data: string): void {
    localStorage.setItem('auth', data);
    let token = jwt_decode(data)
    let tokenObj: loginAuthRes = {
      iat: token.iat,
      name: token.name,
      username: token.username
    }
    window.location.href = '/user/' + tokenObj.username;
  }

  alreadyAuth(): void {
    let dcd = jwt_decode(localStorage.getItem('auth'));
    let route = '/user/' + dcd.username
    this.router.navigate([route])
  }
}
