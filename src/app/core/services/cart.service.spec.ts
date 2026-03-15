// cart.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CartService } from './cart.service';
import { CustomTeaService } from './custom-tea.service';
import { ProductModel } from '../models/product.interface';
import { Category } from '../enums/category.enum';
import { Intensity } from '../enums/intensity.enum';
import { of } from 'rxjs';

describe('CartService', () => {
  let service: CartService;
  let customTeaServiceMock: any;

  beforeEach(() => {
    // ✅ Mock con Vitest (vi.fn())
    customTeaServiceMock = {
      createCustomTea: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: CustomTeaService, useValue: customTeaServiceMock }
      ]
    });

    service = TestBed.inject(CartService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add product to cart', () => {
    const mockProduct: ProductModel = {
      _id: '1',
      name: 'Té Verde',
      price: 10,
      description: 'Test',
      stock: 50,
      category: Category.Matcha,
      quantity: '100g',
      intensity: Intensity.Medium,
      imageUrl: 'test.jpg',
      createdAt: new Date(),
      updateddAt: new Date(),
    };

    service.addProduct(mockProduct, 2);

    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(2);
    expect(service.totalItems()).toBe(2);
    expect(service.totalAmount()).toBe(20);
  });

  it('should increase quantity if product already in cart', () => {
    const mockProduct: ProductModel = {
      _id: '1',
      name: 'Té Verde',
      price: 10,
      description: 'Test',
      stock: 50,
      category: Category.Matcha,
      quantity: '100g',
      intensity: Intensity.Medium,
      imageUrl: 'test.jpg',
      createdAt: new Date(),
      updateddAt: new Date(),
    };

    service.addProduct(mockProduct, 2);
    service.addProduct(mockProduct, 3);

    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(5);
    expect(service.totalItems()).toBe(5);
  });

  it('should update quantity', () => {
    const mockProduct: ProductModel = {
      _id: '1',
      name: 'Té Verde',
      price: 10,
      description: 'Test',
      stock: 50,
      category: Category.Matcha,
      quantity: '100g',
      intensity: Intensity.Medium,
      imageUrl: 'test.jpg',
      createdAt: new Date(),
      updateddAt: new Date(),
    };

    service.addProduct(mockProduct, 2);
    const itemId = service.items()[0].id;

    service.updateQty(itemId, 5);

    expect(service.items()[0].quantity).toBe(5);
    expect(service.totalAmount()).toBe(50);
  });

  it('should remove item from cart', () => {
    const mockProduct: ProductModel = {
      _id: '1',
      name: 'Té Verde',
      price: 10,
      description: 'Test',
      stock: 50,
      category: Category.Matcha,
      quantity: '100g',
      intensity: Intensity.Medium,
      imageUrl: 'test.jpg',
      createdAt: new Date(),
      updateddAt: new Date(),
    };

    service.addProduct(mockProduct, 2);
    const itemId = service.items()[0].id;

    service.removeItem(itemId);

    expect(service.items().length).toBe(0);
    expect(service.totalItems()).toBe(0);
  });

  it('should clear cart', () => {
    const mockProduct: ProductModel = {
      _id: '1',
      name: 'Té Verde',
      price: 10,
      description: 'Test',
      stock: 50,
      category: Category.Matcha,
      quantity: '100g',
      intensity: Intensity.Medium,
      imageUrl: 'test.jpg',
      createdAt: new Date(),
      updateddAt: new Date(),
    };

    service.addProduct(mockProduct, 2);
    service.clear();

    expect(service.items().length).toBe(0);
  });

  it('should add custom tea to cart', async () => {
    const mockCustomTea = {
      _id: 'custom1',
      name: 'Mi Té Personalizado',
      base: 'TE_VERDE',
      ingredients: ['MENTA'],
      intensity: 2,
      size: 'G100',
      calculatedPrice: 15,
      imageUrl: '/assets/custom-tea.jpg',
      userId: 'user1',
      createdAt: new Date(),
      updateddAt: new Date()
    };

    // ✅ Mock con Vitest
    customTeaServiceMock.createCustomTea.mockReturnValue(of(mockCustomTea));

    await service.addCustomTea({
      name: 'Mi Té Personalizado',
      base: 'TE_VERDE' as any,
      ingredients: ['MENTA'] as any,
      intensity: 2,
      size: 'G100' as any,
      calculatedPrice: 15,
      imageUrl: '/assets/custom-tea.jpg'
    }, 1);

    expect(service.items().length).toBe(1);
    expect(service.items()[0].type).toBe('custom-tea');
    expect(service.items()[0].quantity).toBe(1);
    expect(service.totalAmount()).toBe(15);
  });
});
