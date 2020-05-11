import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { Observable, Subscription } from 'rxjs'

import { AuthService, AuthResponseData } from './auth.service'
import { AlertComponent } from '../shared/alert/alert.component'
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true
  isLoading = false
  error: string = null
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective
  private closeSubscription: Subscription

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

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
        this.isLoading = false
        this.error = null
        this.router.navigate(['/recipes'])
      },
      (errorMessage: string) => {
        this.error = errorMessage
        this.showErrorAlert(errorMessage)
        this.isLoading = false
      }
    )

    form.reset()
  }

  onHandleError() {
    this.error = null
  }

  private showErrorAlert(message: string) {
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    )

    const hostViewContainerRef = this.alertHost.viewContainerRef
    hostViewContainerRef.clear()

    const componentRef = hostViewContainerRef.createComponent(alertComponentFactory)
    componentRef.instance.message = message
    this.closeSubscription = componentRef.instance.closeAlert.subscribe(() => {
      this.closeSubscription.unsubscribe()
      hostViewContainerRef.clear()
    })
  }

  ngOnDestroy() {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe()
    }
  }
}
