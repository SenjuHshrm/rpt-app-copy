import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-reassessments',
  templateUrl: './reassessments.component.html',
  styleUrls: ['./reassessments.component.scss']
})
export class ReassessmentsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    if (!localStorage.getItem('auth')) {
      window.location.href = '/'
    }
  }

  landReassessment() {
    let token = jwt_decode(localStorage.getItem('auth'))
    let route = '/user/' + token.username + '/reassessments/land'
    this.router.navigate([route])
  }

  buildingReassessment() {
    let token = jwt_decode(localStorage.getItem('auth'))
    let route = '/user/' + token.username + '/reassessments/building'
    this.router.navigate([route])
  }

  machReassessment() {
    let token = jwt_decode(localStorage.getItem('auth'))
    let route = '/user/' + token.username + '/reassessments/machinery'
    this.router.navigate([route])
  }

}

export default ReassessmentsComponent;
