export interface WeatherUnits {
  temperature: string;
  windSpeed: string;
}

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  units: WeatherUnits;
}
