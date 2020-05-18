import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms'
import { Store } from '@ngrx/store'
import { Subscription } from 'rxjs'
import { map } from 'rxjs/operators'

import * as fromApp from '../../store/app.reducer'
import * as RecipesActions from '../store/recipe.actions'

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number
  editMode = false
  recipeForm: FormGroup
  private storeSubscription: Subscription

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params.id
      this.editMode = Boolean(params.id)
      this.initForm()
    })
  }

  onSubmit() {
    if (this.editMode) {
      this.store.dispatch(
        new RecipesActions.UpdateRecipe({
          index: this.id,
          newRecipe: this.recipeForm.value,
        })
      )
    } else {
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value))
    }

    this.onCancel()
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route })
  }

  onAddIngredient() {
    // tslint:disable-next-line:semicolon whitespace
    ;(this.recipeForm.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+[0-9]*$/)]),
      })
    )
  }

  onDeleteIngredient(index: number) {
    // tslint:disable-next-line:semicolon whitespace
    ;(this.recipeForm.get('ingredients') as FormArray).removeAt(index)
  }

  ngOnDestroy() {
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe()
    }
  }

  private initForm() {
    let recipeName = ''
    let recipeImagePath = ''
    let recipeDescription = ''
    const recipeIngredients = new FormArray([])

    if (this.editMode) {
      this.storeSubscription = this.store
        .select('recipes')
        .pipe(
          map((recipesState) => {
            return recipesState.recipes.find((recipe, index) => index === this.id)
          })
        )
        .subscribe((recipe) => {
          recipeName = recipe.name
          recipeImagePath = recipe.imagePath
          recipeDescription = recipe.description

          if (recipe.ingredients) {
            for (const ingredient of recipe.ingredients) {
              recipeIngredients.push(
                new FormGroup({
                  name: new FormControl(ingredient.name, Validators.required),
                  amount: new FormControl(ingredient.amount, [
                    Validators.required,
                    Validators.pattern(/^[0-9]+[0-9]*$/),
                  ]),
                })
              )
            }
          }
        })
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    })
  }

  get controls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls
  }
}
