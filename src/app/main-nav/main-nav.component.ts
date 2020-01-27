import { Component, OnInit } from '@angular/core';
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
export class MainNavComponent implements OnInit {
  private userFullName: String;
	ltLinks: boolean;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private route: Router) { }

  ngOnInit() { }

  navs: any = [
    { route: 'assessments', text: 'Assessments' },
    { route: 'reassessments', text: 'Reassessments' },
    { route: 'segregation', text: 'Segregation' },
    { route: 'subdivision', text: 'Subdivision' },
    { route: 'faas-records', text: 'Faas Records' },
    { route: 'settings', text: 'Settings' },
    //{ route: '/user/' + this.getUser() + '/land-tax', text: 'Land Tax'},
  ]

	checkAcctLvl() {
		let token: any = jwt_decode(localStorage.getItem('auth'));
		// if(token.type == 'dev' || token.type == 'admin') {
		// 	return true;
		// } else
		return (token.type == 'dev' || token.type == 'admin')
	}

	gotoSettings() {
		// let token = jwt_decode(localStorage.getItem('auth'))
    // let route = '/user/' + this.getUser() + '/settings'
    this.route.navigate(['/settings'])
	}

  getUser() {
    let token: any = jwt_decode(localStorage.getItem('auth'))
    this.userFullName = token.name
    return token.username
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
    localStorage.clear()
    this.route.navigate(['/'])
  }

  expandLt: boolean = false;
  xpandLtLinks() {
    this.expandLt = !this.expandLt;
  }

}
