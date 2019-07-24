import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

export interface Nav {
  route: string;
  text: string;
}

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {
  private userFullName: String;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private route: Router) { }

  navs: Nav[] = [
    { route: '/user/' + this.getUser() + '/assessments', text: 'Assessments' },
    { route: '/user/' + this.getUser() + '/reassessments', text: 'Reassessments' },
    { route: '/user/' + this.getUser() + '/segregation', text: 'Segregation' },
    { route: '/user/' + this.getUser() + '/subdivision', text: 'Subdivision' },
    { route: '/user/' + this.getUser() + '/faas-records', text: 'Faas Records' },
    //{ route: '/user/' + this.getUser() + '/land-tax', text: 'Land Tax'},
  ]

  getUser() {
    if (localStorage.getItem('auth')) {
      let token: any = jwt_decode(localStorage.getItem('auth'))
      this.userFullName = token.name
      return token.username
    }
  }

  gotoClearance() {
    let token = jwt_decode(localStorage.getItem('auth'))
    let route = '/user/' + this.getUser() + '/land-tax/clearance'
    this.route.navigate([route])
  }

  gotoRPTOP() {
    let token: any = jwt_decode(localStorage.getItem('auth'))
    let route = '/user/' + token.username + '/land-tax/rptop'
    this.route.navigate([route])
  }

  gotoArrears() {
    let token: any = jwt_decode(localStorage.getItem('auth'))
    let route = '/user/' + token.username + '/land-tax/arrears'
    this.route.navigate([route])
  }

  nonAuth() {
    return localStorage.getItem('auth') == null
  }

  loggedIn() {
    return localStorage.getItem('auth') != null
  }

  logOut() {
    localStorage.removeItem('auth')
    window.location.href = '/'
  }

}
