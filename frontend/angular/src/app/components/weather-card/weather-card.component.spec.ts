import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { WeatherCardComponent } from './weather-card.component';
import { WeatherService } from '../../services/weather/weather.service';
import { WeatherData } from '../../models/weather.model';

describe('WeatherCardComponent', () => {
  let component: WeatherCardComponent;
  let weatherServiceMock: any;
  let toastrMock: any;

  const mockWeather: WeatherData = {
    city: 'Mumbai',
    country: 'India',
    temperature: 28,
    condition: 'Sunny',
    humidity: 70,
    windSpeed: 12,
    units: {
      temperature: '°C',
      windSpeed: 'km/h'
    }
  };

  beforeEach(async () => {
    weatherServiceMock = {
      getWeather: vi.fn().mockReturnValue(of({ success: true, data: mockWeather }))
    };

    toastrMock = {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [WeatherCardComponent],
      providers: [
        { provide: WeatherService, useValue: weatherServiceMock },
        { provide: ToastrService, useValue: toastrMock }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(WeatherCardComponent);
    component = fixture.componentInstance;
  });

  it('should create the weather card component', () => {
    expect(component).toBeTruthy();
  });

  it('should load default weather into signal on init', () => {
    component.ngOnInit();
    expect(weatherServiceMock.getWeather).toHaveBeenCalled();
    expect(component.weather()).toEqual(mockWeather);
  });

  it('should search weather by city when onSearch is invoked', () => {
    component.searchCity.set('Tokyo');
    component.onSearch();
    expect(weatherServiceMock.getWeather).toHaveBeenCalledWith('Tokyo');
  });
});
