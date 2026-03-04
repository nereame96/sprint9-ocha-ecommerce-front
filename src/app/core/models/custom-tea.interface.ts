import { Base } from '../enums/base.enum';
import { Ingredients } from '../enums/ingredients.enum';
import { Size } from '../enums/size.enum';

export interface CustomTeaModel {
  _id: string;
  userId: string;
  name: string;
  base: Base;
  ingredients: Ingredients[];
  calculatedPrice: number;
  intensity: number;
  size: Size;
  imageUrl: string;
  createdAt: Date;
  updateddAt: Date;
}

export interface CreateCustomTeaDto {
  name: string;
  base: Base;
  ingredients: Ingredients[];
  calculatedPrice: number;
  intensity: number; //es una media calculada de base y ingredients
  size: Size;
  imageUrl: string;
}

export interface CustomTeaBuilder {
  name?: string;
  base?: Base;
  ingredients: Ingredients[];
  intensity?: number;
  size?: Size;
  calculatedPrice?: number;
  imageUrl?: string;
}
