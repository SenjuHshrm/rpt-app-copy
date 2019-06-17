import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss']
})
export class AssessmentsComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    if(!localStorage.getItem('auth')){
      window.location.href = '/'
    }
  }

  landAssessment() {
    let token = jwt_decode(localStorage.getItem('auth'))
    let route = '/user/' + token.username + '/assessments/land'
    this.router.navigate([route])
  }

  buildingAssessment() {
    let token = jwt_decode(localStorage.getItem('auth'))
    let route = '/user/' + token.username + '/assessments/building'
    this.router.navigate([route])
  }

  machAssessment() {
    let token = jwt_decode(localStorage.getItem('auth'))
    let route = '/user/' + token.username + '/assessments/machinery'
    this.router.navigate([route])
  }

}

export default AssessmentsComponent
