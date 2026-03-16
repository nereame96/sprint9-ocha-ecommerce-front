import { inject, Injectable, signal } from '@angular/core';
import { CreateCustomTeaDto, CustomTeaModel } from '../models/custom-tea.interface';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomTeaService {

  private apiUrl = environment.apiUrl + '/custom-tea'
  private authService = inject(AuthService)
  private router = inject(Router)

  private _customTeas = signal<CustomTeaModel[]>([])
  private _loading = signal<boolean>(false)
  private _error = signal<string | null>(null)

  customTeas = this._customTeas.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken()
    return new HttpHeaders ({
      'Authorization': `Bearer ${token}`
    })
  }

  constructor(private http: HttpClient) {}


  loadCustomTeas(): void {
      this._loading.set(true)
      this._error.set(null)

      this.http.get<CustomTeaModel[]>(this.apiUrl, { headers: this.getHeaders()}).subscribe({
        next: (customTeas) => {
          this._customTeas.set(customTeas)
          this._loading.set(false)
        },
        error: (err) => {
          this._error.set('Error loading the events')
          this._loading.set(false)
        }
      })
    }

    createCustomTea(customTeaDto: CreateCustomTeaDto): Observable<CustomTeaModel> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<CustomTeaModel>(this.apiUrl, customTeaDto, { headers: this.getHeaders()}).pipe(
      tap((newCustomTea) => {
        this._customTeas.update(customTeas => [...customTeas, newCustomTea]);
        this._loading.set(false);
      }),
      catchError((err) => {
        this._error.set('Error creating custom tea');
        this._loading.set(false);
        return throwError(() => err);
      })
    );
  }


  calculatePrice(customTea: CreateCustomTeaDto): number {

    const basePrices: Record<string, number> = {
      'Matcha': 9,
      'Sencha': 8,
      'Hojicha': 8,
      'Gyokuro': 10,
    }

    const sizeMultiplier: Record<string, number> = {
    '50gr': 1,
    '100gr': 1.8,
    '250gr': 2.5
  };

  const priceIngredient = 1

  const basePrice = basePrices[customTea.base] || 0
  const ingredientsPrice = (customTea.ingredients?.length || 0 ) * priceIngredient  
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

    const numberOfElements = 1 + (customTea.ingredients.length || 0)

    const averageIntensity = ( totalIntensity / numberOfElements )

    const maxIntensity = 10
    const percentage = (averageIntensity / maxIntensity) * 100

    return Math.round(percentage)
  }
}
