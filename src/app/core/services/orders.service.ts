import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { OrderModel } from '../models/order.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiUrl = environment.apiUrl + '/order'
  private http = inject(HttpClient)
  private authService = inject(AuthService)

  private _userOrders = signal<OrderModel[]>([])
  private _loading = signal<boolean>(false)
  private _error = signal<string | null>(null)

  userOrders = this._userOrders.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken()
    return new HttpHeaders ({
      'Authorization': `Bearer ${token}`
    })
  }



  loadUserOrders(): void {
      this._loading.set(true);
      this._error.set(null);

      this.http.get<OrderModel[]>(`${this.apiUrl}/user/my-orders`, {headers: this.getHeaders() }).subscribe({
        next: (orders) => {
            this._userOrders.set(orders);
            this._loading.set(false);
          },
          error: (err) => {
            this._error.set('Could not load your orders.');
            this._loading.set(false);
          }
      })


     }
}
