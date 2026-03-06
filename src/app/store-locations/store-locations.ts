import {
  Component,
  inject,
  Input,
  OnDestroy,
  EventEmitter,
  Output,
  signal,
  effect,
  AfterViewInit
} from '@angular/core';
import * as L from 'leaflet';
import { StoreLocationsService } from '../core/services/store-locations.service';
import { MapService } from '../core/services/map.service';
import { tap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-store-locations',
  imports: [],
  templateUrl: './store-locations.html',
  styleUrl: './store-locations.css',
})
export class StoreLocationsComponent implements AfterViewInit, OnDestroy {
  public storeLocationsService = inject(StoreLocationsService);
  private mapService = inject(MapService);


  mode: 'view' | 'select' = 'view';
  @Input() initialCoords?: { lat: number; lng: number };
  showStoreMarkers: boolean = true;
  @Input() centerCoords: [number, number] = [41.40237282641176, 2.194541858893481];
  @Input() zoom: number = 13;

  @Output() locationSelected = new EventEmitter<{ lat: number; lng: number }>();

  private readonly containerId = 'map';
  private map: L.Map | undefined;
  private storeMarkers: L.Marker[] = [];

  stores = this.storeLocationsService.storeLocations;
  selectedLocation = signal<{ lat: number; lng: number } | null>(null);
  activeStoreId = signal<string | null>(null);


 ngAfterViewInit(): void {

  const element = document.getElementById(this.containerId);
  if (!element) {
    console.error(`Element with id '${this.containerId}' not found in DOM`);
    return;
  }

  this.initMap();

  if (this.mode === 'view' && this.showStoreMarkers) {
    this.loadAndPaintStores();
  }
}

  private loadAndPaintStores(): void {
  console.log('Loading stores...');

  this.storeLocationsService.loadStoreLocations().subscribe({
    next: (stores) => {
      console.log('Stores loaded:', stores);

      if (stores && stores.length > 0) {
        this.paintStoreMarkers(stores);
      } else {
        console.warn('No stores found');
      }
    },
    error: (err) => {
      console.error('Error loading stores:', err);
    }
  });
}

  private initMap(): void {

  let center: [number, number] = [41.40237, 2.19454];

  if (this.initialCoords?.lat !== undefined && this.initialCoords?.lng !== undefined) {
    center = [this.initialCoords.lat, this.initialCoords.lng];

  } else if (
    this.centerCoords &&
    this.centerCoords.length === 2 &&
    this.centerCoords.every(c => typeof c === 'number')
  ) {
    center = this.centerCoords;
  }

  const zoom = typeof this.zoom === 'number' ? this.zoom : 13;


  this.map = this.mapService.initMap({
    containerId: this.containerId,
    center,
    zoom,
  });

  setTimeout(() => {
    this.map?.invalidateSize();
  }, 100);

  if (
    this.mode === 'view' &&
    this.initialCoords?.lat !== undefined &&
    this.initialCoords?.lng !== undefined
  ) {
    this.mapService.createMarker(this.map, {
      lat: this.initialCoords.lat,
      lng: this.initialCoords.lng,
      icon: this.mapService.createSelectionIcon(),
      popup: 'Store location',
    });
  }
}

  private paintStoreMarkers(stores: any[]): void {
    if (!this.map) return;

    this.mapService.removeMarkers(this.storeMarkers);
    this.storeMarkers = this.mapService.createStoreMarkers(this.map, stores);

    console.log(`Marcadores pintados: ${this.storeMarkers.length} de ${stores.length}`);
  }

  ngOnDestroy(): void {
    this.mapService.destroyMap(this.containerId);
  }


  focusStore(index: number): void {
    if (!this.map || this.storeMarkers.length === 0) return

    const marker = this.storeMarkers[index]

    this.activeStoreId.set(this.stores()[index]._id)

    if (marker) {
      this.map.flyTo(marker.getLatLng(), 16, { duration: 1.5})
    }
    marker.openPopup()
  }

}
