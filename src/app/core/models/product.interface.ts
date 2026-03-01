import { Category } from "../enums/category.enum";
import { Intensity } from "../enums/intensity.enum";

export interface ProductModel {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
  quantity: string;  // siempre 100gr
  intensity: Intensity;
  imageUrl: string;
  isActive?: boolean;  // para desactivar productos
  rating?: number;
  soldCount?: number;
  createdAt: Date;
  updateddAt: Date;
}
