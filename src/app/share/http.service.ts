import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DailyForecastsModel} from './models/DailyForecasts.model';
import {HourlyForecastsModel} from './models/HourlyForecasts.model';
import {CityModel} from './models/City.model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  private apiKey = '6RGW2B1fAkVuOCmRD3epsgZqU7OYFtd4';
  URL_LOCATION = 'http://dataservice.accuweather.com/locations/v1/cities/search';
  URL_LOCATION_KEY = 'http://dataservice.accuweather.com/locations/v1/';
  URL_FORECAST = 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/';
  URL_HOURLY_FORECAST = 'http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/';
  URL_IP = 'http://dataservice.accuweather.com/locations/v1/cities/ipaddress';

  private language: string;


  getLocationByIp(): Observable<CityModel> {
    return this.http.get<CityModel>(this.URL_IP + '?apikey=' + this.apiKey + '&language=ru');
  }

  getLocation(city): Observable<CityModel[]> {
    return this.http.get<CityModel[]>(this.URL_LOCATION + '?apikey=' + this.apiKey + '&q=' + city + '&language=' +
      this.getLanguage());
  }

  getLocationByKey(key): Observable<CityModel> {
    return this.http.get<CityModel>(this.URL_LOCATION_KEY + key + '?apikey=' + this.apiKey + '&language=' +
      this.getLanguage());
  }

  getForecast(key): Observable<DailyForecastsModel> {
    return this.http.get<DailyForecastsModel>(this.URL_FORECAST + key + '?apikey=' + this.apiKey + '&language='
      + this.getLanguage() + '&metric=true');
  }

  getHourlyForecast(key): Observable<HourlyForecastsModel[]> {
    return this.http.get<HourlyForecastsModel[]>(this.URL_HOURLY_FORECAST + key + '?apikey=' + this.apiKey + '&language='
      + this.getLanguage() + '&metric=true');
  }

  private getLanguage() {
    this.language = localStorage.getItem('language');
    if (this.language === null) {
      this.language = 'ru';
      localStorage.setItem('language', this.language);
    }
    return this.language;
  }
}
