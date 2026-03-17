import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProductsService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  productsService = inject(ProductsService)
  cartService = inject(CartService)

  featuredProducts = computed(() => {
    const allProducts = this.productsService.products()

    if (!allProducts || allProducts.length === 0) return []

    let randomProducts = [...allProducts].sort(() => 0.5 - Math.random())
    return randomProducts.slice(0, 4)

  })

}
