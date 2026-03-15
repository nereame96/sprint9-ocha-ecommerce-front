import { it, describe, beforeEach, afterEach, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CartService } from '../services/cart.service';

describe('Auth', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const FAKE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  beforeEach(() => {

    const mockCartService = {
      clear: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),

        { provide: CartService, useValue: mockCartService }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });


  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save token to localStorage', () => {
    service.saveToken(FAKE_JWT);
    expect(localStorage.getItem('token')).toBe(FAKE_JWT);
  });

  it('should get token from localStorage', () => {
    localStorage.setItem('token', FAKE_JWT);
    expect(service.getToken()).toBe(FAKE_JWT);
  });

  it('should make POST request on login', () => {
    const mockResponse = { access_token: FAKE_JWT };
    const credentials = { userName: 'test', password: 'test123' };

    service.login(credentials).subscribe(response => {
      expect(response.access_token).toBe(FAKE_JWT);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockResponse);
  });

  it('should clear token on logout', () => {
    localStorage.setItem('token', FAKE_JWT);
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
