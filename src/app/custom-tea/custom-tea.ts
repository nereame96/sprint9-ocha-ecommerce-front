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

  isLoading = signal<boolean>(false);

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
      imageUrl: '/assets/default-custom-tea.jpg', //falta poner una imagen
    };
  });

  toggleIngredient(ingredient: Ingredients): void {
    this.selectedIngredients.update((currentIngredients) => {
      const haveIngredient = currentIngredients.includes(ingredient);

     if (currentIngredients.includes(ingredient)) {
        return currentIngredients.filter((item) => item !== ingredient);
      }


      if (currentIngredients.length >= 4) {
        alert('Max. 4 ingredients allowed');
        return currentIngredients;
      }

      return [...currentIngredients, ingredient];

      
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

  async addToCart(): Promise<void> {
    const customTea = this.customTea();

    if (!customTea) {
      alert('Please select a base and size before adding to cart');
      return
    }

    try {
      this.isLoading.set(true)

      await this.cartService.addCustomTea(customTea, 1)

      alert('Custom tea added to Cart')

      this.resetForm()

    } catch (error) {
      alert('Error adding Custom tea to Cart. Please, try again.')

    } finally {
      this.isLoading.set(false)
    }
  }

  private resetForm(): void {
    this.selectedBase.set(null);
    this.selectedIngredients.set([]);
    this.selectedSize.set(null);
    this.currentName.set('');
  }
}
