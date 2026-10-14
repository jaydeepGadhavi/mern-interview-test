import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { WeatherService } from './weather.service';
import { ApiService } from '../api/api.service';
import { WeatherData } from '../../models/weather.model';

describe('WeatherService', () => {
  let service: WeatherService;
  let apiServiceMock: any;

  const mockWeather = { city: 'Ahmedabad' } as WeatherData;

  beforeEach(() => {
    apiServiceMock = {
      get: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        WeatherService,
        { provide: ApiService, useValue: apiServiceMock }
      ]
    });

    service = TestBed.inject(WeatherService);
  });

  it('should call apiService.get without params when no city is provided', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: mockWeather }));

    service.getWeather().subscribe(res => {
      expect(res.data).toEqual(mockWeather);
    });

    expect(apiServiceMock.get).toHaveBeenCalledWith('/weather', undefined);
  });

  it('should call apiService.get with city params when city is provided', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: mockWeather }));

    service.getWeather('Ahmedabad').subscribe(res => {
      expect(res.data).toEqual(mockWeather);
    });

    expect(apiServiceMock.get).toHaveBeenCalledWith('/weather', { city: 'Ahmedabad' });
  });
});
