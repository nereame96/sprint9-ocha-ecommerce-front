import { TestBed } from '@angular/core/testing';

import { CustomTeaService } from './custom-tea.service';

describe('CustomTeaService', () => {
  let service: CustomTeaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomTeaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
