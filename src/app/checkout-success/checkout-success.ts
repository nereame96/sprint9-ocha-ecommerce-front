import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../core/services/cart.service';
import { OrdersService } from '../core/services/orders.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-success',
  imports: [],
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.css',
})
export class CheckoutSuccessComponent implements OnInit {

  private cartService = inject(CartService)
  private ordersService = inject(OrdersService)
  private router = inject(Router)

  ngOnInit() {
    this.saveOrderToDatabase()
  }

  saveOrderToDatabase() {
    const savedOrderString = localStorage.getItem('pending_order')

    if (!savedOrderString) {
      this.router.navigate(['/'])
      return
    }

    const finalOrderPayload = JSON.parse(savedOrderString)

    finalOrderPayload.isPaid = true;
    finalOrderPayload.paymentMethod = 'card';

    this.ordersService.createOrder(finalOrderPayload).subscribe({
      next: (orderSaved) => {
        console.log('✅ ¡Pedido guardado en Mongo Atlas!', orderSaved);
        localStorage.removeItem('pending_order')
        this.cartService.clear()
      },
      error: (err) => {
        console.error('Error al guardar el pedido en base de datos:', err);
      }
    });
  }
  }


