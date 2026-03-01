import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register';
import { LoginComponent } from './auth/login/login';
import { HomeComponent } from './shared/home/home';
import { ProductsListComponent } from './products/products-list/products-list';
import { ProductDetailComponent } from './products/product-detail/product-detail';

export const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'home',
    component: HomeComponent
  },

  {
    path: 'products-list',
    component: ProductsListComponent
  },

  {
    path: 'product-detail',
    component: ProductDetailComponent
  }


];
