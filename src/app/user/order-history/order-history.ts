import { Component, inject, OnInit } from '@angular/core';
import { OrdersService } from '../../core/services/orders.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-history',
  imports: [DatePipe, RouterLink, CurrencyPipe],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistoryComponent implements OnInit {
  ordersService = inject(OrdersService);
  orders = this.ordersService.userOrders
  loading = this.ordersService.loading
  error = this.ordersService.error

  ngOnInit(): void {
     this.ordersService.loadUserOrders()

  }


}
