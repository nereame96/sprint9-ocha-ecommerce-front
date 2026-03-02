import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTea } from './custom-tea';

describe('CustomTea', () => {
  let component: CustomTea;
  let fixture: ComponentFixture<CustomTea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomTea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomTea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
