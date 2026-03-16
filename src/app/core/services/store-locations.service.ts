
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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


  loadStoreLocations(): Observable<StoreLocation[]> {


    this._loading.set(true);
    this._error.set(null);

    return this.http.get<StoreLocation[]>(this.apiUrl).pipe(
      tap((stores: StoreLocation[]) => {

        this._storeLocations.set(stores);

        this._loading.set(false);
      }),
      catchError((err: any) => {
        console.error('[SERVICE] Error:', err);
        this._error.set('Error loading the store locations');
        this._loading.set(false);
        return of([]);
      })
    );
  }

  getStoreById(id: string): Observable<StoreLocation> {
    return this.http.get<StoreLocation>(`${this.apiUrl}/${id}`);
  }
}
