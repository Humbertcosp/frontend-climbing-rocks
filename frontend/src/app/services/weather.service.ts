// src/app/services/weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface CurrentResponse {
  weather: { description: string; icon: string }[];
  main: { temp: number };
}

interface OneCallResponse {
  hourly: {
    dt: number;
    temp: number;
    weather: { icon: string }[];
  }[];
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private API_KEY = 'abff16a36540c4600e1572dc73f17d84';
  // endpoint para clima actual
  private CURRENT_BASE = 'https://api.openweathermap.org/data/2.5/weather';
  // endpoint para previsión horaria
  private ONECALL_BASE  = 'https://api.openweathermap.org/data/2.5/onecall';

  constructor(private http: HttpClient) {}

  getWeather(lat: number, lon: number): Observable<CurrentResponse> {
    const url = `${this.CURRENT_BASE}?lat=${lat}&lon=${lon}&appid=${this.API_KEY}`;
    return this.http.get<CurrentResponse>(url);
  }
}
