import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Router } from '@angular/router';
import { ProductModel } from '../../core/models/product.interface';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetailComponent   {

  id = input<string>()

  productsService = inject(ProductsService)
  private router = inject(Router)

  product = signal<ProductModel | null>(null)

    private loadProductsEffect = effect(() => {  //creado una propiedad privada nos ahorrramos el constructor
      const productId = this.id()

      if(productId) {
        this.productsService.getProductById(productId).subscribe({
          next: (data) => this.product.set(data),
          error: (err) => {
            throw new Error ('Error loading products', err)
          }
        })
      }

    }
    )


  }



