import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar';
import { CartComponent } from './cart/cart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CartComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sprint9-ocha-ecommerce-front');
}
