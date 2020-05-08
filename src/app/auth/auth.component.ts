import { Component } from '@angular/core'
import { NgForm } from '@angular/forms'

import { AuthService } from './auth.service'
import { AuthResponseData } from './auth.service'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  isLoginMode = true
  isLoading = false
  error: string = null

  constructor(private authService: AuthService) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return
    }

    const email = form.value.email
    const password = form.value.password
    this.isLoading = true

    let authObservable: Observable<AuthResponseData>

    if (this.isLoginMode) {
      authObservable = this.authService.login(email, password)
    } else {
      authObservable = this.authService.signup(email, password)
    }

    authObservable.subscribe(
      (responseData: AuthResponseData) => {
        console.log(responseData)
        this.isLoading = false
        this.error = null
      },
      (errorMessage: string) => {
        console.log(errorMessage)
        this.error = errorMessage
        this.isLoading = false
      }
    )

    form.reset()
  }
}
