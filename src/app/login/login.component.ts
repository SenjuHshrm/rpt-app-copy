import { Component, OnInit } from '@angular/core';
import { Credentials } from '../classes/cred';
import { login } from '../services/login.service';
import { loginAuthRes } from '../classes/login';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SetAuthRoute } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
	public loginStat: string;

  constructor(
    private auth: login,
    private setRoute: SetAuthRoute,
  ) { }

  ngOnInit() {
    if(localStorage.getItem('auth')){
      this.setRoute.alreadyAuth()
    }
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  loginErr = false
  isVisible_spinner = false
  login(form) {
    if(this.loginForm.valid){
      let data: Credentials = {
        username: form.username,
        password: form.password
      }
      this.auth.authenticateUser(data).subscribe(res => {
        if(!res.success){
          this.loginErr = true
					this.loginStat = res.status
        } else {
          this.isVisible_spinner = true
          this.setRoute.storeToken(res.token)
        }
      })
    }
  }

  nonAuth() {
    return localStorage.getItem('auth') == null
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  }

}

export default LoginComponent
