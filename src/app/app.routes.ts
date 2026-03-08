import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register';
import { LoginComponent } from './auth/login/login';
import { HomeComponent } from './shared/home/home';
import { ProductsListComponent } from './products/products-list/products-list';
import { ProductDetailComponent } from './products/product-detail/product-detail';
import { CartComponent } from './cart/cart';
import { CustomTeaComponent } from './custom-tea/custom-tea';
import { StoreLocationsComponent } from './store-locations/store-locations';
import { ProfileInfoComponent } from './user/profile-info/profile-info';
import { OrderHistoryComponent } from './user/order-history/order-history';
import { UserProfileComponent } from './user/user-profile/user-profile';
import { authGuard } from './guards/auth-guard';

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
    path: 'product-detail/:id',
    component: ProductDetailComponent
  },

  {
    path: 'custom-tea',
    component: CustomTeaComponent
  },

  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'store-locations',
    component: StoreLocationsComponent
  },

  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [authGuard],
    children: [
        { path: '', redirectTo: 'info', pathMatch: 'full' },
        { path: 'info', component: ProfileInfoComponent } ,
        { path: 'orders', component: OrderHistoryComponent },

    ]
  },


];
