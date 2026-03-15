import { TestBed } from '@angular/core/testing';
import { CustomTeaService } from './custom-tea.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { vi } from 'vitest';

describe('CustomTeaService - Calculations', () => {
  let service: CustomTeaService;

  beforeEach(() => {
    const mockAuthService = { getToken: vi.fn() };
    const mockRouter = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        CustomTeaService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ],
    });
    service = TestBed.inject(CustomTeaService);
  });

  describe('Price Calculation', () => {

    it('should calculate price correctly for base only (Matcha 50g)', () => {
      const price = service.calculatePrice({
        base: 'Matcha',
        ingredients: [],
        size: '50gr',
      } as any);


      expect(price).toBe(9);
    });

    it('should add exactly 1€ per ingredient', () => {
      const priceWithIngredients = service.calculatePrice({
        base: 'Matcha',
        ingredients: ['Cardamomo', 'Ginger'],
        size: '50gr',
      } as any);

      expect(priceWithIngredients).toBe(11);
    });

    it('should apply the 250g size multiplier (x2.5) correctly', () => {
      const price250g = service.calculatePrice({
        base: 'Sencha',
        ingredients: [],
        size: '250gr',
      } as any);


      expect(price250g).toBe(20);
    });
  });


  describe('Intensity Calculation', () => {

    it('should calculate base percentage correctly (Matcha = 6/10 = 60%)', () => {
      const intensity = service.calculateIntensity({
        base: 'Matcha',
        ingredients: [],
        size: '50gr'
      } as any);

      expect(intensity).toBe(60);
    });

    it('should calculate average intensity with ingredients', () => {
      const intensity = service.calculateIntensity({
        base: 'Sencha',
        ingredients: ['Lemon', 'Ginger'],
        size: '50gr'
      } as any);


      expect(intensity).toBe(47);
    });
  });
});
