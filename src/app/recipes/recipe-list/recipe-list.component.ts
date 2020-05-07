import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'

import { Recipe } from '../recipe.model'
import { RecipeService } from '../recipe.service'
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[]
  subscription: Subscription

  constructor(
    private recipeServise: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription = this.recipeServise.recipesChanged.subscribe((recipes: Recipe[]) => {
      this.recipes = recipes
    })
    this.recipes = this.recipeServise.getRecipes()
  }

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
