import { Component, Input, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  template: `<div id="map"></div>`,
  standalone: false,
  styles: [`
    :host { display: block; height: 200px; border-radius: 12px; overflow: hidden; margin-bottom: 16px; }
    #map { width: 100%; height: 100%; }
  `]
})
export class MapComponent implements AfterViewInit {
  @Input() center!: { lat: number; lon: number };
  @Input() marker?: { lat: number; lon: number };

  ngAfterViewInit() {
    const map = L.map('map').setView([this.center.lat, this.center.lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);
    if (this.marker) {
      L.marker([this.marker.lat, this.marker.lon]).addTo(map);
    }
  }
}