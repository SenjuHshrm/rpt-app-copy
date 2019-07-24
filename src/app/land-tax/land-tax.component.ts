import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-land-tax',
  templateUrl: './land-tax.component.html',
  styleUrls: ['./land-tax.component.scss']
})
export class LandTaxComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }

  gotoClearance() {
    let token: any = jwt_decode(localStorage.getItem('auth'))
    let route = '/user/' + token.username + '/land-tax/clearance'
    this.router.navigate([route])
  }

  gotoRPTOP() {
    let token: any = jwt_decode(localStorage.getItem('auth'))
    let route = '/user/' + token.username + '/land-tax/rptop'
    this.router.navigate([route])
  }
}

export default LandTaxComponent
