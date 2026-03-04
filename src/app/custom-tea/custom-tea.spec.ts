import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTeaComponent } from './custom-tea';

describe('CustomTea', () => {
  let component: CustomTeaComponent;
  let fixture: ComponentFixture<CustomTeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomTeaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomTeaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
