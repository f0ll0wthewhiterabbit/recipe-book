import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core'

import { Ingredient } from 'src/app/shared/ingredient.model'

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput') nameInputRef: ElementRef
  @ViewChild('amountInput') amountInputRef: ElementRef
  @Output() ingredientAdded: EventEmitter<Ingredient> = new EventEmitter<Ingredient>()

  constructor() {}

  ngOnInit(): void {}

  onAddItem(event: Event) {
    event.preventDefault()

    const newIngredient = new Ingredient(
      this.nameInputRef.nativeElement.value,
      this.amountInputRef.nativeElement.value
    )

    this.ingredientAdded.emit(newIngredient)
  }
}
