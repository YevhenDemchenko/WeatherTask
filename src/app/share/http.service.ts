import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  private apiKey = '6RGW2B1fAkVuOCmRD3epsgZqU7OYFtd4';
  URL_LOCATION = 'http://dataservice.accuweather.com/locations/v1/cities/search?apikey=' + this.apiKey + '&q=';
  URL_LOCATION_AUTO = 'http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=' + this.apiKey + '&q=';
  URL_LOCATION_KEY = 'http://dataservice.accuweather.com/locations/v1/';
  URL_CURRENT_CONDITIONS = 'http://dataservice.accuweather.com/currentconditions/v1/';
  URL_FORECAST = 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/';
  URL_HOURLY_FORECAST = 'http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/';


  searchLocation(city) {
    return this.http.get(this.URL_LOCATION + city);
  }

  searchLocationAuto(city) {
    return this.http.get(this.URL_LOCATION_AUTO + city);
  }

  searchLocationKey(key) {
    return this.http.get(this.URL_LOCATION_KEY + key + '?apikey=' + this.apiKey);
  }

  getCurrentConditions(key) {
    return this.http.get(this.URL_CURRENT_CONDITIONS + key + '?apikey=' + this.apiKey);
  }

  getForecast(key) {
    return this.http.get(this.URL_FORECAST + key + '?apikey=' + this.apiKey);
  }

  getHourlyForecast(key) {
    return this.http.get(this.URL_HOURLY_FORECAST + key + '?apikey=' + this.apiKey);
  }
}
