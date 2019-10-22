import { Component } from '@angular/core';
import { BnNgIdleService } from 'bn-ng-idle';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'rpt-app';

  constructor(
    private BnIdle: BnNgIdleService) {
    this.BnIdle.startWatching(900).subscribe(res => {
      if(res) {  
        if(localStorage.getItem('auth')) {
          let type: any = jwt_decode(localStorage.getItem('auth'));
          if(type.type == "dev") {
            console.log("Session disabled, you are Dev");
            this.BnIdle.stopTimer();
          } else {
            localStorage.clear();
            this.BnIdle.stopTimer();
            window.location.href = '/';
          }
        } else {
          this.BnIdle.stopTimer();
        }
      }
    })
  }
}
