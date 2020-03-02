import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {HttpService} from '../share/http.service';
import {CityModel} from '../share/models/city.model';
import {CurrentConditionsModel} from '../share/models/currentConditions.model';
import {DailyForecastsModel} from '../share/models/DailyForecasts.model';
import {TransferService} from '../share/transfer.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit, OnDestroy {

  constructor(private httpService: HttpService, private transferService: TransferService ) { }

  isLoad: boolean;
  usersServiceSubscriptions: Subscription = new Subscription();

  isWeatherDownload: boolean;
  weatherInCity: CurrentConditionsModel;
  myCitiesArray: Array<CityModel>;

  forecastArr: Array<DailyForecastsModel>;
  citiesArr = new Array<CityModel>();

  city: CityModel;
  key = 325825;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.isWeatherDownload = false;

    this.myCitiesArray = JSON.parse(localStorage.getItem('cities'));
    console.log(this.myCitiesArray);

    if (this.myCitiesArray.length !== undefined) {
      this.city = this.myCitiesArray[0];
    } else {
      // @ts-ignore
      this.city = this.myCitiesArray;
    }

    this.isLoad = true;
    console.log(this.city);
    if (localStorage.getItem('cities') !== null) {
      if (this.transferService.Key.getValue() !== null) {
        this.loadLocationForecast(this.transferService.Key.getValue());
      } else {
        this.loadLocationForecast(this.city.Key);
      }
    }
  }

  private loadLocationForecast(key) {
    //this.city = this.myCitiesArray;
    this.httpService.getForecast(key).subscribe(data => {
      // @ts-ignore
      this.forecastArr = data.DailyForecasts;
      this.isWeatherDownload = true;
      console.log(data);
    });
  }

  private loadLocationKey(key) {
    this.httpService.getCurrentConditions(key).subscribe((data2: CurrentConditionsModel[]) => {
      this.weatherInCity = data2[0];
      this.isWeatherDownload = true;
      console.log(data2);
    });
  }

  ngOnDestroy() {
    this.usersServiceSubscriptions.unsubscribe();
  }
}
