import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetailComponent implements OnInit {

  productsService = inject(ProductsService)
  private router = inject(Router)

  products = this.productsService.products
  isLoadinf = this.productsService.loading
  error = this.productsService.error



  ngOnInit(): void {
    this.productsService.loadProducts()

  }
}
