import { Injectable, EventEmitter, Output } from '@angular/core'

import { Recipe } from './recipe.model'

@Injectable()
export class RecipeService {
  @Output() recipeSelected: EventEmitter<Recipe> = new EventEmitter<Recipe>()

  private recipes: Recipe[] = [
    new Recipe(
      'Test recipe',
      'This is simply a test',
      'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg'
    ),
    new Recipe(
      'Test recipe2',
      'This is simply a test',
      'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg'
    ),
  ]

  getRecipes(): Recipe[] {
    return this.recipes.slice()
  }
}
