import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Router, RouterLink } from '@angular/router';
import { ProductDetailComponent } from '../product-detail/product-detail';
import { CartService } from '../../core/services/cart.service';
import { Category } from '../../core/enums/category.enum';

@Component({
  selector: 'app-products-list',
  imports: [RouterLink],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsListComponent implements OnInit {


  productsService = inject(ProductsService)
  cartService = inject(CartService)
  private router = inject(Router)

  filteredProducts = this.productsService.filteredProducts;
  selectedCategory = this.productsService.selectedCategory;
  categoryList = this.productsService.categoryList;

  isLoading = this.productsService.loading;
  error = this.productsService.error;



  ngOnInit(): void {
    this.productsService.loadProducts()

  }

  onSelectCategory(category: Category | null) {
    this.productsService.setCategoryFilter(category);
  }



}
