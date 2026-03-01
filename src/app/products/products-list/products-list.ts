import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Router, RouterLink } from '@angular/router';
import { ProductDetailComponent } from '../product-detail/product-detail';

@Component({
  selector: 'app-products-list',
  imports: [RouterLink],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsListComponent implements OnInit {


  productsService = inject(ProductsService)
  private router = inject(Router)

  products = this.productsService.products
  isLoadinf = this.productsService.loading
  error = this.productsService.error



  ngOnInit(): void {
    this.productsService.loadProducts()

  }

}
