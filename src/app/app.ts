import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar';
import { CartComponent } from './cart/cart';
import { FooterComponent } from './layout/footer/footer';
import { ToastService } from './core/services/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CartComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sprint9-ocha-ecommerce-front');
  public toastService = inject(ToastService);
}
