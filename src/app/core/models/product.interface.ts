import { Category } from "../enums/category.enum";
import { Intensity } from "../enums/intensity.enum";

export interface ProductModel {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
  quantity: string;
  intensity: Intensity;
  imageUrl: string;
  isActive?: boolean;  
  rating?: number;
  soldCount?: number;
  createdAt: Date;
  updateddAt: Date;
}
