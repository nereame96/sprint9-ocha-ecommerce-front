import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from "../models/user-api";
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private apiUrl = environment.apiUrl + '/users';
  private http = inject(HttpClient)
  private authService = inject(AuthService)
  private _users = signal<User[]>([])
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _currentUserProfile = signal<User | null>(null)

  users = this._users.asReadonly()
  loading = this._loading.asReadonly()
  error = this._error.asReadonly()
  isUserOpen = signal(false);
  currentUserProfile = this._currentUserProfile.asReadonly()

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken()
    return new HttpHeaders ({
      'Authorization': `Bearer ${token}`
    })
  }


  loadUsers(): void {
      this._loading.set(true);
      this._error.set(null);

      this.http.get<User[]>(this.apiUrl, {headers: this.getHeaders() }).subscribe({
        next: (users) => {
          this._users.set(users);
          this._loading.set(false);
        },
        error: (err) => {
          this._error.set('Error loading users');
          this._loading.set(false);
        }
      });
    }

   loadUserProfile(userId: string): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<User>(`${this.apiUrl}/${userId}`, {headers: this.getHeaders() }).subscribe({
      next: (user) => {
          this._currentUserProfile.set(user);
          this._loading.set(false);
        },
        error: (err) => {
          this._error.set('Could not load your profile data.');
          this._loading.set(false);
        }
    })


   }

  toggleCart(): void {
  this.isUserOpen.set(!this.isUserOpen());
  }
}
