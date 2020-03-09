import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {HttpService} from '../share/http.service';
import {CityModel} from '../share/models/City.model';
import {Router} from '@angular/router';
import {TransferService} from '../share/transfer.service';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-my-cities',
  templateUrl: './myCities.component.html',
  styleUrls: ['./myCities.component.scss']
})
export class MyCitiesComponent implements OnInit, OnDestroy {

  constructor(private httpService: HttpService, private router: Router, private transferService: TransferService) {
  }

  searchLocationAutoSubscription: Subscription = new Subscription();
  locationByIpSubscriptions: Subscription = new Subscription();
  locationKeySubscriptions: Subscription = new Subscription();

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['LocalizedName', 'Country', 'AdministrativeArea', 'button'];

  myCitiesArray: Array<CityModel>;
  selectedCity: CityModel;
  city: CityModel;

  isLoad = false;
  isSearchCompleted = false;
  isErrorVisible = false;
  language: string;

  observableLocation: Observable<CityModel[]>;
  observableLocationByKey: Observable<CityModel>;
  observableLocationByIp: Observable<CityModel>;

  ngOnInit() {
    this.myCitiesArray = JSON.parse(localStorage.getItem('cities'));
    this.language = localStorage.getItem('language');

    if (this.language === null) {
      this.language = 'ru';
      localStorage.setItem('language', this.language);
    }

    this.selectedCity = null;

    if (!!this.myCitiesArray) {
      this.city = this.myCitiesArray[0];
      this.isLoad = true;
    } else {
      this.myCitiesArray = new Array<CityModel>();
      this.getLocationByIp();
    }
  }

  private searchLocation(city) {
    this.observableLocation = this.httpService.getLocation(city);
    this.searchLocationAutoSubscription = this.observableLocation.subscribe({
      next: (data: CityModel[]) => {
        this.dataSource.data = data;
      },
      complete: () => {
        this.isSearchCompleted = true;
      },
      error: error => {
        this.isLoad = false;
        this.isErrorVisible = true;
        console.error('There was an error!', error);
      }
    });
  }

  private navigateToWeatherPage(city) {
    this.transferService.Key.next(city.Key);
    this.router.navigate(['weather']);
  }

  private addLocationByKeyToStorage(key) {
    this.observableLocationByKey = this.httpService.getLocationByKey(key);
    this.locationKeySubscriptions = this.observableLocationByKey.subscribe({
      next: (data: CityModel) => {
        this.selectedCity = new CityModel(data.Key, data.LocalizedName, data.Country);
      },
      complete: () => {
        this.myCitiesArray.push(this.selectedCity);
        localStorage.setItem('cities', JSON.stringify(this.myCitiesArray));
      },
      error: error => {
        this.isLoad = false;
        this.isErrorVisible = true;
        console.error('There was an error!', error);
      }
    });
  }

  private async addCity(city) {
    let isFind = false;
    const cityInLocalStorage = this.myCitiesArray.filter(e => e.Key === city.Key);

    if (cityInLocalStorage.length !== 0) {
      isFind = true;
    }

    if (!isFind) { this.addLocationByKeyToStorage(city.Key); }
  }

  private deleteCity(city: CityModel) {
    this.myCitiesArray.splice(this.myCitiesArray.indexOf(this.myCitiesArray.filter(e => e.Key === city.Key)[0]), 1);
    localStorage.setItem('cities', JSON.stringify(this.myCitiesArray));
  }

  private getLocationByIp() {
    this.observableLocationByIp = this.httpService.getLocationByIp();
    this.locationByIpSubscriptions = this.observableLocationByIp.subscribe({
      next: (data: CityModel) => {
        this.city = new CityModel(data.Key, data.LocalizedName, data.Country);
      },
      complete: () => {

        this.myCitiesArray.push(this.city);
        this.isLoad = true;
      },
      error: error => {
        this.isLoad = false;
        this.isErrorVisible = true;
        console.error('There was an error!', error);
      }
    });
  }

  ngOnDestroy() {
    this.searchLocationAutoSubscription.unsubscribe();
    this.locationByIpSubscriptions.unsubscribe();
    this.locationKeySubscriptions.unsubscribe();
  }
}
