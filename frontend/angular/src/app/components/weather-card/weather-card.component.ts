import { Component, OnInit, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WeatherService } from '../../services/weather/weather.service';
import { WeatherData } from '../../models/weather.model';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [],
  templateUrl: './weather-card.component.html'
})
export class WeatherCardComponent implements OnInit {
  private weatherService = inject(WeatherService);
  private toastr = inject(ToastrService);

  searchCity = signal<string>('');
  weather = signal<WeatherData | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchWeather();
  }

  fetchWeather(city?: string): void {
    this.errorMessage.set(null);

    this.weatherService.getWeather(city).subscribe({
      next: (res) => {
        if (res?.data) {
          this.weather.set(res.data);
          if (city) {
            this.toastr.success(`Weather loaded for ${res.data.city}!`);
          }
        }
      },
      error: (err: any) => {
        const msg = typeof err === 'string' ? err : (err?.message || `Could not find weather for "${city}"`);
        this.errorMessage.set(msg);
        this.toastr.error(msg);
      }
    });
  }

  onSearch(): void {
    const city = this.searchCity().trim();
    if (!city) return;
    this.fetchWeather(city);
  }
}
