// src/app/features/sectores/sectores-details/sectores-details.page.ts
import { Component, OnInit, ViewChild }     from '@angular/core';
import { ActivatedRoute }        from '@angular/router';
import { forkJoin }              from 'rxjs';
import { map, switchMap }        from 'rxjs/operators';
import { SectoresService }       from '../../../services/sector.service';
import { WeatherService }        from 'src/app/services/weather.service';
import { Sector }                from '../../models/sector.model';
import { IonContent } from '@ionic/angular';

@Component({
  selector   : 'app-sector-details',
  templateUrl: './sectores-details.page.html',
  styleUrls  : ['./sectores-details.page.scss'],
  standalone: false
})
export class SectoresDetailsPage implements OnInit {
  @ViewChild('content', { read: IonContent }) content!: IonContent;
  scrolled = false;
  tab: 'info' | 'rutas' | 'horas' = 'info';
  sector?: Sector;
  walkTime?: number; 
  weather?: { temp: number; desc: string; icon: string };
  hourlyForecast: { time: string; temp: number; icon: string }[] = [];

  constructor(
    private route      : ActivatedRoute,
    private sectoresSrv: SectoresService,
    private weatherSrv : WeatherService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(p => p.get('sectorId')!),
      switchMap(id => this.sectoresSrv.getById(id)!)
    ).subscribe(sec => {
      if (!sec) return;
      this.sector = sec;
      this.calcWalkTime(sec);
    });
  }

  private calcWalkTime(sec: Sector) {
    // Necesitamos ambas coordenadas
    const plat = sec.parkingLat, plon = sec.parkingLon;
    const slat = sec.lat, slon = sec.lon;
    if (plat == null || plon == null || slat == null || slon == null) {
      this.walkTime = undefined;
      return;
    }

    const dKm = this.haversine(plat, plon, slat, slon);
    // Asumimos 5 km/h → 12 min/km
    this.walkTime = Math.round(dKm * 12);
  }

  /** Haversine → distancia en km */
  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (v: number) => v * Math.PI / 180;
    const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2)**2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon/2)**2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }
}