// store-locations.service.ts
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';  // ← Importar of
import { tap, catchError } from 'rxjs/operators';  // ← Importar operadores
import { StoreLocation } from '../models/store-location.interface';

@Injectable({
  providedIn: 'root',
})
export class StoreLocationsService {

  private apiUrl = environment.apiUrl + '/store-locations';
  private _storeLocations = signal<StoreLocation[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  storeLocations = this._storeLocations.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  constructor(private http: HttpClient) {}

  // ✅ Retorna Observable para poder suscribirse
  loadStoreLocations(): Observable<StoreLocation[]> {
    console.log('🔄 [SERVICE] Loading stores from:', this.apiUrl);

    this._loading.set(true);
    this._error.set(null);

    return this.http.get<StoreLocation[]>(this.apiUrl).pipe(
      tap((stores: StoreLocation[]) => {
        console.log('✅ [SERVICE] API Response:', stores);
        console.log('✅ [SERVICE] Number of stores:', stores?.length || 0);

        if (stores && stores.length > 0) {
          stores.forEach((store: StoreLocation, index: number) => {
            console.log(`[SERVICE] Store ${index}:`, {
              name: store.name,
              lat: store.lat,
              lng: store.lng,
              hasValidCoords: !!(store.lat && store.lng)
            });
          });
        }

        this._storeLocations.set(stores);
        console.log('✅ [SERVICE] Signal updated');
        this._loading.set(false);
      }),
      catchError((err: any) => {
        console.error('❌ [SERVICE] Error:', err);
        this._error.set('Error loading the store locations');
        this._loading.set(false);
        return of([]); // Retornar array vacío en caso de error
      })
    );
  }

  getStoreById(id: string): Observable<StoreLocation> {
    return this.http.get<StoreLocation>(`${this.apiUrl}/${id}`);
  }
}
