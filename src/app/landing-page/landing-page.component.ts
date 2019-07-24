import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
    if(localStorage.getItem('auth')){
      // if(jwt_decode(localStorage.getItem('auth')) instanceof Object) {
			// 	window.location.href = '/'
			// }
			try {
				jwt_decode(localStorage.getItem('auth'));
			} catch (e) {
				window.location.href = '/'
			}
    } else {
			window.location.href = '/'
		}
  }

}

export default LandingPageComponent
