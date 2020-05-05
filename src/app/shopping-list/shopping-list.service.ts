import { Injectable, Output } from '@angular/core'
import { Subject } from 'rxjs'

import { Ingredient } from '../shared/ingredient.model'

@Injectable()
export class ShoppingListService {
  @Output() ingredientsChanged: Subject<Ingredient[]> = new Subject<Ingredient[]>()
  private ingredients: Ingredient[] = [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)]

  getIngredients(): Ingredient[] {
    return this.ingredients.slice()
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient)
    this.ingredientsChanged.next(this.ingredients.slice())
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients)
    this.ingredientsChanged.next(this.ingredients.slice())
  }
}
