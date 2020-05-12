import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'

import { Ingredient } from '../shared/ingredient.model'
import * as ShoppingListActions from './store/shopping-list.actions'
import * as fromShoppingList from './store/shopping-list.reducer'

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ ingredients: Ingredient[] }>

  constructor(private store: Store<fromShoppingList.AppState>) {}

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList')
  }

  onEditItem(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index))
  }
}
