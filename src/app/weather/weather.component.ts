import {Component, OnDestroy, OnInit} from '@angular/core';
import {concat, Observable, Subscription} from 'rxjs';
import {HttpService} from '../share/http.service';
import {CityModel} from '../share/models/City.model';
import {DailyForecastsModel, ForecastDay} from '../share/models/DailyForecasts.model';
import {TransferService} from '../share/transfer.service';
import {HourlyForecastsModel} from '../share/models/HourlyForecasts.model';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit, OnDestroy {

  constructor(private httpService: HttpService, private transferService: TransferService ) { }

  isLoad: boolean;
  isErrorVisible = false;

  forecastSubscriptions: Subscription = new Subscription();
  hourlySubscriptions: Subscription = new Subscription();
  locationByIpSubscriptions: Subscription = new Subscription();

  myCitiesArray: Array<CityModel>;
  forecastArr: Array<ForecastDay>;
  forecastHourArr: Array<HourlyForecastsModel>;

  city: CityModel;
  language: string;

  observableForecast: Observable<DailyForecastsModel>;
  observableHourlyForecast: Observable<HourlyForecastsModel[]>;
  observableLocationByIp: Observable<CityModel>;

  ngOnInit() {
    this.myCitiesArray = JSON.parse(localStorage.getItem('cities'));
    this.language = localStorage.getItem('language');

    if (this.language === null) {
      this.language = 'ru';
      localStorage.setItem('language', this.language);
    }

    if (!!this.myCitiesArray) {
      if (this.transferService.Key.getValue() !== null) {
        this.loadLocationForecast(this.transferService.Key.getValue());
      } else {
        this.loadLocationForecast(this.myCitiesArray[0].Key);
      }
    } else {
      this.getLocationByIp();
    }
  }

  private loadLocationForecast(key) {
    if (!!this.myCitiesArray) {
      this.city = this.myCitiesArray.filter((e) => e.Key.toString() === key.toString())[0];
    } else {
      this.myCitiesArray = new Array<CityModel>();
      this.myCitiesArray.push(this.city);
    }

    this.forecastHourArr = new Array<HourlyForecastsModel>();
    this.forecastArr = new Array<ForecastDay>();

    this.getForecast(key);
    this.loadLocationHourlyKey(key);

    this.onLoadingDone();
  }

  private onLoadingDone() {
    concat(this.observableForecast, this.observableHourlyForecast).subscribe({
      complete: () => {
        this.isLoad = true;
      },
      error: error => {
        this.isLoad = false;
        this.isErrorVisible = true;
        console.error('There was an error!', error);
      }
    });
  }

  private getForecast(key) {
    this.observableForecast = this.httpService.getForecast(key);
    this.forecastSubscriptions = this.observableForecast.subscribe({
      next: (data: DailyForecastsModel) => {
        data.DailyForecasts.forEach((e) => {
          this.forecastArr.push(new ForecastDay(e.Date, e.Temperature, e.Day, e.Night));
        });
      },
      error: error => {
        this.isLoad = false;
        this.isErrorVisible = true;
        console.error('There was an error!', error);
      }
    });
  }

  private loadLocationHourlyKey(key) {
    this.observableHourlyForecast = this.httpService.getHourlyForecast(key);
    this.hourlySubscriptions = this.observableHourlyForecast.subscribe( {
      next: (data: HourlyForecastsModel[]) => {
        data.forEach((e) => {
          this.forecastHourArr.push(new HourlyForecastsModel(e.Key, e.DateTime, e.IconPhrase, e.Temperature, e.WeatherIcon));
        });
      },
      error: error => {
        this.isLoad = false;
        this.isErrorVisible = true;
        console.error('There was an error!', error);
      }
    });
  }

  private getLocationByIp() {
    this.observableLocationByIp = this.httpService.getLocationByIp();
    this.locationByIpSubscriptions = this.observableLocationByIp.subscribe({
      next: (data: CityModel) => {
        this.city = new CityModel(data.Key, data.LocalizedName, data.Country);
      },
      complete: () => {
        this.loadLocationForecast(this.city.Key);
      },
      error: error => {
        this.isLoad = false;
        this.isErrorVisible = true;
        console.error('There was an error!', error);
      }
    });
  }

  ngOnDestroy() {
    this.forecastSubscriptions.unsubscribe();
    this.hourlySubscriptions.unsubscribe();
    this.locationByIpSubscriptions.unsubscribe();
  }
}
