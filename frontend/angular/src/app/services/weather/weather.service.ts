import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { WeatherData } from '../../models/weather.model';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiService = inject(ApiService);

  getWeather(city?: string): Observable<ApiResponse<WeatherData>> {
    const params = city && city.trim() ? { city: city.trim() } : undefined;
    return this.apiService.get<ApiResponse<WeatherData>>('/weather', params);
  }
}
