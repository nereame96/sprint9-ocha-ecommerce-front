import { Component, inject, signal, computed } from '@angular/core';
import { CustomTeaService } from '../core/services/custom-tea.service';
import { Base } from '../core/enums/base.enum';
import { Ingredients } from '../core/enums/ingredients.enum';
import { Size } from '../core/enums/size.enum';
import { FormBuilder, FormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { CreateCustomTeaDto } from '../core/models/custom-tea.interface';
import { CartService } from '../core/services/cart.service';

@Component({
  selector: 'app-custom-tea',
  imports: [FormsModule],
  templateUrl: './custom-tea.html',
  styleUrl: './custom-tea.css',
})
export class CustomTeaComponent {
  customTeaService = inject(CustomTeaService);
  cartService = inject(CartService);

  selectedBase = signal<Base | null>(null);
  selectedIngredients = signal<Ingredients[]>([]);
  selectedSize = signal<Size | null>(null);
  currentName = signal<string>('');

  baseList = Object.values(Base);
  ingredientsList = Object.values(Ingredients);
  sizeList = Object.values(Size);

  currentIntensity = computed(() => {
    const currentBase = this.selectedBase();

    if (!currentBase) return 0;

    return this.customTeaService.calculateIntensity({
      base: currentBase,
      ingredients: this.selectedIngredients(),
    } as any);
  });

  currentPrice = computed(() => {
    const currentBase = this.selectedBase();
    const currentSize = this.selectedSize();

    if (!currentBase || !currentSize) return 0;

    return this.customTeaService.calculatePrice({
      base: currentBase,
      size: currentSize,
      ingredients: this.selectedIngredients(),
    } as any);
  });

  customTea = computed(() => {
    const currentBase = this.selectedBase();
    const currentSize = this.selectedSize();

    if (!currentBase || !currentSize) return null;

    return {
      name: this.currentName(),
      base: currentBase,
      ingredients: this.selectedIngredients(),
      calculatedPrice: this.currentPrice(),
      intensity: this.currentIntensity(),
      size: currentSize,
      imageUrl: 'assets/default-custom-tea.jpg', //falta poner una imagen
    };
  });

  toggleIngredient(ingredient: Ingredients): void {
    this.selectedIngredients.update((currentIngredients) => {
      const haveIngredient = currentIngredients.includes(ingredient);

      if (haveIngredient) {
        return currentIngredients.filter((item) => item !== ingredient);
      } else {
        if (currentIngredients.length >= 4) {
          alert('Max. 4 ingredients is allow');
          return currentIngredients;
        } else {
          return [...currentIngredients, ingredient];
        }
      }
    });
  }

  setBase(base: Base) {
    this.selectedBase.set(base);
  }

  setSize(size: Size) {
    this.selectedSize.set(size);
  }

  setName(name: string) {
    this.currentName.set(name);
  }

  addToCart() {
    const customTea = this.customTea();

    if (customTea) {
      this.cartService.addCustomTea(customTea, 1);
    } else {
      alert('Please select a base and size before adding to cart');
    }
  }
}
