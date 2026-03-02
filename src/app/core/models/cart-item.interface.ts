import { ProductModel } from "./product.interface";

export interface CartItem {
  id: string;
  type: 'product' | 'custom-tea';
  productId?: string;
  customTeaId?: string;
  name: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
