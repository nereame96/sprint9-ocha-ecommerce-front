import { Component, inject } from '@angular/core';
import { CartService } from '../core/services/cart.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderCustomTea, OrderProduct } from '../core/models/order.interface';
import { CurrencyPipe } from '@angular/common';
import { OrdersService } from '../core/services/orders.service';

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

  checkoutForm = this.fb.group({
    street: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['', Validators.required],
    phone: ['', Validators.required],
  })

  onPay() {
    if (this.checkoutForm.invalid || this.cartService.items().length === 0) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

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

    console.log('📦 PAYLOAD LISTO PARA EL BACKEND:', orderPayload);

    console.log('📦 Solicitando sesión de pago a Stripe...');

    localStorage.setItem('pending_order', JSON.stringify(orderPayload));

  // Delegamos el trabajo sucio al servicio
  this.ordersService.createCheckoutSession(orderPayload).subscribe({
    next: (response) => {
      // El componente solo se encarga de cambiar de ventana
      window.location.href = response.url;
    },
    error: (err) => {
      console.error('Error al contactar con Stripe:', err);
      alert('Hubo un problema al procesar el pago. Inténtalo de nuevo.');
    }
  });
  }

}
