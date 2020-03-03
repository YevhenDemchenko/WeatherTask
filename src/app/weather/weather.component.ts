import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatPaginator} from '@angular/material';
import {HttpService} from '../share/http.service';
import {CityModel} from '../share/models/City.model';
import {DailyForecastsModel} from '../share/models/DailyForecasts.model';
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
  forecastSubscriptions: Subscription = new Subscription();
  hourlySubscriptions: Subscription = new Subscription();

  isWeatherDownload: boolean;
  myCitiesArray: Array<CityModel>;

  forecastArr: Array<DailyForecastsModel>;
  forecastHourArr: Array<HourlyForecastsModel>;

  city: CityModel[];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.myCitiesArray = JSON.parse(localStorage.getItem('cities'));

    this.city = this.myCitiesArray;
    this.isWeatherDownload = false;
    this.isLoad = true;

    if (localStorage.getItem('cities') !== null) {
      if (this.transferService.Key.getValue() !== null) {
        this.loadLocationForecast(this.transferService.Key.getValue());
      } else {
        this.loadLocationForecast(this.city[0].Key);
      }
    }
  }

  private loadLocationForecast(key) {
    if (this.myCitiesArray.length !== undefined) {
      this.city = this.myCitiesArray.filter((e) => e.Key.toString() === key.toString());
    } else {
      this.city = this.myCitiesArray;
    }

    this.forecastSubscriptions = this.httpService.getForecast(key).subscribe((data: DailyForecastsModel)  => {
      this.forecastArr = data.DailyForecasts;
      this.isWeatherDownload = true;
    });

    this.loadLocationHourlyKey(key);
  }

  private loadLocationHourlyKey(key) {
    this.hourlySubscriptions = this.httpService.getHourlyForecast(key).subscribe((data2: HourlyForecastsModel[]) => {
      this.forecastHourArr = data2;
    });
  }

  ngOnDestroy() {
    this.forecastSubscriptions.unsubscribe();
    this.hourlySubscriptions.unsubscribe();
  }
}
