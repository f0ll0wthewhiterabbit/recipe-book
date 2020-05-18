import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { Store } from '@ngrx/store'

import * as fromApp from '../store/app.reducer'
import * as AuthActions from '../auth/store/auth.actions'
import * as RecipesActions from '../recipes/store/recipe.actions'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true
  isAuthenticated = false
  private userSubscription: Subscription

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.userSubscription = this.store
      .select('auth')
      .pipe(map((authStore) => authStore.user))
      .subscribe((user) => {
        this.isAuthenticated = !!user
      })
  }

  onSaveData() {
    this.store.dispatch(new RecipesActions.StoreRecipes())
  }

  onFetchData() {
    this.store.dispatch(new RecipesActions.FetchRecipes())
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout())
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe()
    }
  }
}
