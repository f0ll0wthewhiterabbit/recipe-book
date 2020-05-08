import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError } from 'rxjs/operators'
import { throwError } from 'rxjs'

import { environment } from 'src/environments/environment'

export interface AuthResponseData {
  idToken: string
  email: string
  refreshToken: string
  expiresIn: string
  localId: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        catchError((errorResponse) => {
          let errorMessage = 'An unknown error occurred!'

          if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(errorMessage)
          }

          switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'This email exists already'
              break

            default:
              break
          }

          return throwError(errorMessage)
        })
      )
  }
}
