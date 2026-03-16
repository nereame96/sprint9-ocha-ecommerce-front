import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Router } from '@angular/router';
import { ProductModel } from '../../core/models/product.interface';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetailComponent {
  id = input<string>();

  productsService = inject(ProductsService);
  cartService = inject(CartService);
  private router = inject(Router);

  product = signal<ProductModel | null>(null);
  quantity = signal<number>(1);

  private loadProductsEffect = effect(() => {
    
    const productId = this.id();

    if (productId) {
      this.productsService.getProductById(productId).subscribe({
        next: (data) => this.product.set(data),
        error: (err) => {
          throw new Error('Error loading products', err);
        },
      });
    }
  });

  increaseQty(): void {
    const currentQty = this.quantity();
    const maxStock = this.product()?.stock || 0;

    if (currentQty < maxStock) {
      this.quantity.update((q) => q + 1);
    }
  }

  decreaseQty(): void {
    const currentQty = this.quantity();

    if (currentQty > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  addToCart(): void {
    const product = this.product();
    const qty = this.quantity();

    if (product) {
      this.cartService.addProduct(product, qty);

    }
  }
}
