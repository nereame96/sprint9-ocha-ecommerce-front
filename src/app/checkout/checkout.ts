import { Component, inject } from '@angular/core';
import { CartService } from '../core/services/cart.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderCustomTea, OrderProduct } from '../core/models/order.interface';
import { CurrencyPipe } from '@angular/common';
import { OrdersService } from '../core/services/orders.service';
import { ToastService } from '../core/services/toast';

@Component({
  selector: 'app-checkout',
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class CheckoutComponent {

  cartService = inject(CartService)
  ordersService = inject(OrdersService)
  private fb = inject(FormBuilder)
  private toastService = inject(ToastService)

  checkoutForm = this.fb.group({
    street: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['', Validators.required],
    phone: ['', Validators.required, Validators.minLength(9)],
  })

  onPay() {
    if (this.checkoutForm.invalid || this.cartService.items().length === 0) {
      this.checkoutForm.markAllAsTouched();
      this.toastService.show('Please complete all required fields', 'error');
      return;
    }

    this.toastService.show('Redirecting to payment simulation...', 'info');

    const formValues = this.checkoutForm.value
    const cartItems = this.cartService.items()

    const orderProducts: OrderProduct[] = []
    const orderCustomTeas: OrderCustomTea[] = []

    cartItems.forEach(item => {
      if (item.type === 'product' && item.productId) {
        orderProducts.push({
          productId: item.productId,
          name: item.name,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })
      } else if ( item.type === 'custom-tea' && item.customTeaId ) {
        orderCustomTeas.push({
          customTeaId: item.customTeaId,
          name: item.name,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })
      }
    })

    const orderPayload = {
      products: orderProducts,
      customTeas: orderCustomTeas,
      totalAmount: this.cartService.totalAmount(),
      totalItems: this.cartService.totalItems(),
      deliveryAddress: {
        street: formValues.street,
        city: formValues.city,
        postalCode: formValues.postalCode,
        country: formValues.country
      },
      phone: formValues.phone
    };



    localStorage.setItem('pending_order', JSON.stringify(orderPayload));


  this.ordersService.createCheckoutSession(orderPayload).subscribe({
    next: (response) => {
      window.location.href = response.url;
    },
    error: (err) => {
      console.error('Error al contactar con Stripe:', err);
      this.toastService.show('Payment gateway error. Please try again.', 'error');
    }
  });
  }

}
