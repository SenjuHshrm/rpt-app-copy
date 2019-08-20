import { Component, OnInit } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
		if (!localStorage.getItem('auth')) {
      window.location.href = '/'
    } else {
			let token: any = jwt_decode(localStorage.getItem('auth'));
			if (token.type == 'regular') {
				let route = '/user/' + token.username;
				this.router.navigate([route])
			}
		}
  }

}
