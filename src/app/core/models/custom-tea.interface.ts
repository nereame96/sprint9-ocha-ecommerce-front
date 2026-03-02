import { Base } from "../enums/base.enum";
import { Ingredients } from "../enums/ingredients.enum";
import { Quantity } from "../enums/quantity.enum";

export interface CustomTeaModel {
  _id: string;
  userId: string;
  name: string;
  base: Base;
  ingredients: Ingredients[];
  calculatedPrice: number;
  intensity: number;
  quantity: Quantity;
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
  quantity: Quantity;
  imageUrl: string;
}

export interface CustomTeaBuilder {
  name?: string;
  base?: Base;
  ingredients: Ingredients[];
  intensity?: number;
  quantity?: Quantity;
  calculatedPrice?: number;
  imageUrl?: string;
}
