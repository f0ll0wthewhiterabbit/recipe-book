import { Component, ComponentFactoryResolver, ViewChild, OnDestroy, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { Observable, Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import * as fromApp from '../store/app.reducer'
import * as AuthActions from '../auth/store/auth.actions'

import { AuthService, AuthResponseData } from './auth.service'
import { AlertComponent } from '../shared/alert/alert.component'
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true
  isLoading = false
  error: string = null
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective
  private closeSubscription: Subscription

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.store.select('auth').subscribe((authState) => {
      this.isLoading = authState.loading
      this.error = authState.authError

      if (this.error) {
        this.showErrorAlert(this.error)
      }
    })
  }

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
      this.store.dispatch(new AuthActions.LoginStart({ email, password }))
    } else {
      authObservable = this.authService.signup(email, password)
    }

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
