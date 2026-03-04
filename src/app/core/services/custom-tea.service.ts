import { Injectable } from '@angular/core';
import { CreateCustomTeaDto } from '../models/custom-tea.interface';

@Injectable({
  providedIn: 'root',
})
export class CustomTeaService {

  calculatePrice(customTea: CreateCustomTeaDto): number {

    const basePrices: Record<string, number> = {
      'Matcha': 9,
      'Sencha': 8,
      'Hojicha': 8,
      'Gyokuro': 10,
    }

    const sizeMultiplier: Record<string, number> = { //tocara cambiar quantity por size, es confuso, revisar el addCustomTea to cart
    '50gr': 1,
    '100gr': 1.8,
    '250gr': 2.5
  };

  const basePrice = basePrices[customTea.base] || 0
  const ingredientsPrice = (customTea.ingredients?.length || 0 ) * 1  //   1 eur/ingredient
  const multiplier = sizeMultiplier[customTea.size] || 1
  const finalPrice = (basePrice + ingredientsPrice) * multiplier

  return Math.round(finalPrice * 100) / 100;

  }


  calculateIntensity(customTea: CreateCustomTeaDto): number {

    const baseIntensity: Record<string, number> = {
      'Matcha': 6,
      'Sencha': 4,
      'Hojicha': 4,
      'Gyokuro': 6,
    }
    const ingredientsIntensity: Record<string, number> = {
      'Lemon': 6,
      'Cardamomo': 4,
      'Ginger': 4,
      'Jasmine': 6,
    }

    let totalIntensity = baseIntensity[customTea.base] || 0

    if (customTea.ingredients?.length > 0) {
      for (const ingredient of customTea.ingredients) {
        totalIntensity += ingredientsIntensity[ingredient] || 0
      }
    }
    console.log(totalIntensity)
    const numberOfElements = 1 + (customTea.ingredients.length || 0)

    const averageIntensity = ( totalIntensity / numberOfElements )

    const maxIntensity = 10
    const percentage = (averageIntensity / maxIntensity) * 100

    return Math.round(percentage)
  }
}
