import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatPaginator} from '@angular/material';
import {HttpService} from '../share/http.service';
import {CityModel} from '../share/models/City.model';
import {DailyForecastsModel} from '../share/models/DailyForecasts.model';
import {TransferService} from '../share/transfer.service';
import {HourlyForecastsModel} from '../share/models/HourlyForecasts.model';
import {map} from 'rxjs/operators';

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

  key = '325825';
  city: CityModel[];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  async ngOnInit() {
    this.myCitiesArray = JSON.parse(localStorage.getItem('cities'));

    this.isWeatherDownload = false;

    if (this.myCitiesArray !== null) {
      if (this.transferService.Key.getValue() !== null) {
        this.loadLocationForecast(this.transferService.Key.getValue());
      } else {
        this.loadLocationForecast(this.key);
      }
    } else {
      // @ts-ignore
      this.city = await this.httpService.searchLocationKey(this.key).pipe(map((data: CityModel) => data)).toPromise();
      this.loadLocationForecast(this.key);
    }
  }

  private loadLocationForecast(key) {
    if (this.myCitiesArray !== null) {
      if (this.myCitiesArray.length !== undefined) {
        this.city = this.myCitiesArray.filter((e) => e.Key.toString() === key.toString());
      } else {
        this.city = this.myCitiesArray;
      }
    } else {
      this.myCitiesArray = this.city;
    }

    this.forecastSubscriptions = this.httpService.getForecast(key).subscribe((data: DailyForecastsModel)  => {
      this.forecastArr = data.DailyForecasts;
      this.isWeatherDownload = true;
    });
    this.isLoad = true;
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
