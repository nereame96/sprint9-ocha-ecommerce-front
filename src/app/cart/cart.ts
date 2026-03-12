import { Component, inject, signal } from '@angular/core';
import { CartService } from '../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent {

  cartService = inject(CartService)



  increaseQty(itemId: string): void {
    const item = this.cartService.items().find( item => item.id === itemId)

    if (item) {
      this.cartService.updateQty(itemId, item.quantity + 1)
    }
  }

  decreaseQty(itemId: string): void {
    const item = this.cartService.items().find( item => item.id === itemId)

    if (item && item.quantity > 1) {
      this.cartService.updateQty(itemId, item.quantity - 1)
    }
  }

  removeItem(itemId: string): void {
    this.cartService.removeItem(itemId)

  }

  clearCart(): void {
    if (confirm('¿Clear the cart?')) {
      this.cartService.clear();
    }
  }
}
