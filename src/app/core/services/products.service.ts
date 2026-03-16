import { ProductModel } from './../models/product.interface';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Category } from '../enums/category.enum';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  private apiUrl = environment.apiUrl + '/products'
  private authService = inject(AuthService)
  private router = inject(Router)

  private _products = signal<ProductModel[]>([])
  private _loading = signal<boolean>(false)
  private _error = signal<string | null>(null)
  private _selectedCategory = signal<Category | null>(null)

  selectedCategory = this._selectedCategory.asReadonly();
  products = this._products.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();


  categoryList = Object.values(Category)

  constructor(private http: HttpClient) {}

  loadProducts(): void {
    this._loading.set(true)
    this._error.set(null)

    this.http.get<ProductModel[]>(this.apiUrl).subscribe({
      next: (products) => {
        this._products.set(products)
        this._loading.set(false)
      },
      error: (err) => {
        this._error.set('Error loading the events')
        this._loading.set(false)
      }
    })
  }

  filteredProducts = computed(() => {
    const products = this._products()
    const category = this._selectedCategory()

    if (!category) return products

    return products.filter( product => product.category === category)

  })

  setCategoryFilter(category: Category | null) {
    this._selectedCategory.set(category)
  }

  getProductById(id: string): Observable<ProductModel> {
    return this.http.get<ProductModel>(`${this.apiUrl}/${id}`)
  }

}
