import { CustomTeaBuilder, CustomTeaModel } from './../models/custom-tea.interface';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ProductModel } from '../models/product.interface';
import { CartItem } from '../models/cart-item.interface';
import { CreateCustomTeaDto } from '../models/custom-tea.interface';
import { CustomTeaService } from './custom-tea.service';
import { firstValueFrom } from 'rxjs';
import { ToastService } from './toast';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private readonly STORAGE_KEY = 'tea_cart';
  private customTeaService = inject(CustomTeaService)
  private toastService = inject(ToastService)

  items = signal<CartItem[]>([]);

  totalItems = computed(() =>
    this.items().reduce((acc, item) => acc + item.quantity, 0)
  )

  totalAmount = computed(() =>
    this.items().reduce((acc, item) => acc + item.totalPrice, 0)
  )

  isCartOpen = signal(false);



  constructor() {
    this.loadFromStorage();
  }

  toggleCart(): void {
  this.isCartOpen.set(!this.isCartOpen());
  }

  addProduct(product: ProductModel, quantity: number): void {

    const items = this.items()
    const existingIndex = items.findIndex( item => item.type === 'product' && item.productId === product._id)


  if (existingIndex > -1) {
    items[existingIndex].quantity += quantity;
    items[existingIndex].totalPrice = items[existingIndex].quantity * items[existingIndex].unitPrice;
  } else {
    items.push({
        id: `product-${product._id}-${Date.now()}`,
        type: 'product',
        productId: product._id,
        name: product.name,
        imageUrl: product.imageUrl,
        quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity,
    })

  }

  this.items.set([...items])
  this.saveToStorage()
  this.toastService.show(`${product.name} added to cart`, 'success');

}

async addCustomTea(customTea: CustomTeaModel | CustomTeaBuilder, quantity: number = 1): Promise<void> {

  let customTeaWithId: CustomTeaModel

  if ('_id' in customTea && customTea._id) {
    customTeaWithId = customTea as CustomTeaModel
  } else {

    try {
      const dto: CreateCustomTeaDto = {
        name: customTea.name || 'My custom-tea',
        base: customTea.base!,
        ingredients: customTea.ingredients || [],
        intensity: customTea.intensity!,
        size: customTea.size!,
        calculatedPrice: customTea.calculatedPrice! || 0,
        imageUrl: customTea.imageUrl || '/assets/default-custom-tea.jpg'

      }

      customTeaWithId = await firstValueFrom(this.customTeaService.createCustomTea(dto))

    } catch (error) {
      this.toastService.show('Error creating your custom tea', 'error');
      throw error
    }

  }


  const items = this.items();
  const existingIndex = items.findIndex(item => item.type === 'custom-tea' && item.customTeaId === customTeaWithId._id )


  if (existingIndex > -1) {
    items[existingIndex].quantity += quantity
    items[existingIndex].totalPrice = items[existingIndex].quantity * items[existingIndex].unitPrice
  } else {

    items.push({
      id: `custom-tea-${customTeaWithId._id}`,
      type: 'custom-tea',
      customTeaId: customTeaWithId._id,
      name: customTeaWithId.name,
      imageUrl: customTeaWithId.imageUrl || '/assets/default-custom-tea.jpg',
      quantity,
      unitPrice: customTeaWithId.calculatedPrice,
      totalPrice: customTeaWithId.calculatedPrice * quantity,
      });
  }


    this.items.set([...items]);
    this.saveToStorage();
    this.toastService.show('Custom tea added to cart', 'success');
}

updateQty(itemId: string, newQuantity: number): void {
  if (newQuantity < 1) return

  const items = this.items()
  const index = items.findIndex( item => item.id === itemId)

  if (index > -1) {
    items[index].quantity = newQuantity
    items[index].totalPrice = items[index].unitPrice * newQuantity
  }

  this.items.set([...items]);
  this.saveToStorage();
}

removeItem(itemId: string): void {
  this.items.update(items => items.filter(item => item.id !== itemId))
  this.saveToStorage();
}

clear(): void {
    this.items.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
    this.toastService.show('Cart cleared', 'info');
  }


private saveToStorage(): void {
  localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items()))
}

private loadFromStorage(): void {
  const stored = localStorage.getItem(this.STORAGE_KEY)
  if(stored) {
    try {
      const parsed = JSON.parse(stored)
      this.items.set(parsed)
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      this.items.set([]);
    }
  }
}

}
