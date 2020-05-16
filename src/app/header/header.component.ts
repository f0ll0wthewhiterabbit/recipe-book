import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { Store } from '@ngrx/store'

import { DataStorageService } from '../shared/data-storage.service'
import { AuthService } from '../auth/auth.service'
import * as fromApp from '../store/app.reducer'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true
  isAuthenticated = false
  private userSubscription: Subscription

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.userSubscription = this.store
      .select('auth')
      .pipe(map((authStore) => authStore.user))
      .subscribe((user) => {
        this.isAuthenticated = !!user
      })
  }

  onSaveData() {
    this.dataStorageService.storeRecipes()
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe()
  }

  onLogout() {
    this.authService.logout()
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe()
    }
  }
}
