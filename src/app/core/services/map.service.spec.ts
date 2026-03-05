import { MapService } from './map.service';
import { TestBed } from '@angular/core/testing';



describe('StoreLocationsService', () => {
  let service: MapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
