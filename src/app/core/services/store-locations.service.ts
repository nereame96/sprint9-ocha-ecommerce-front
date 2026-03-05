import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StoreLocation } from '../models/store-location.interface';

@Injectable({
  providedIn: 'root',
})
export class StoreLocationsService {

  private apiUrl = environment.apiUrl + '/store-locations'
  private authService = inject(AuthService)
  private router = inject(Router)

  private _storeLocations = signal<StoreLocation[]>([])
  private _loading = signal<boolean>(false)
  private _error = signal<string | null>(null)

  products = this._storeLocations.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();



  constructor(private http: HttpClient) {}

  loadStoreLocations(): void {
    this._loading.set(true)
    this._error.set(null)

    this.http.get<StoreLocation[]>(this.apiUrl).subscribe({
      next: (stores) => {
        this._storeLocations.set(stores)
        this._loading.set(false)
      },
      error: (err) => {
        this._error.set('Error loading the events')
        this._loading.set(false)
      }
    })
  }





  getProductById(id: string): Observable<StoreLocation> {
    return this.http.get<StoreLocation>(`${this.apiUrl}/${id}`)
  }

}


