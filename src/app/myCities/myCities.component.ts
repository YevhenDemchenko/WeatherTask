import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {HttpService} from '../share/http.service';
import {CityModel} from '../share/models/city.model';
import {CurrentConditionsModel} from '../share/models/currentConditions.model';
import {Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {DailyForecastsModel} from '../share/models/DailyForecasts.model';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {TransferService} from '../share/transfer.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-myCities',
  templateUrl: './myCities.component.html',
  styleUrls: ['./myCities.component.scss']
})
export class MyCitiesComponent implements OnInit {

  constructor(private httpService: HttpService, private router: Router, private transferService: TransferService) {
  }
  myCitiesArray: Array<CityModel>;

  citiesArr = new Array<CityModel>();

  stateCtrl = new FormControl();
  allCities: Array<CityModel>;

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['local', 'country', 'region', 'button'];

  arr: Array<CityModel>;


  selectedCity: CityModel;
  isLoad: boolean;
  isSearchCompleted: boolean;
  city: CityModel;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.myCitiesArray = JSON.parse(localStorage.getItem('cities'));
    if (this.myCitiesArray.length !== undefined) {
      this.city = this.myCitiesArray[0];
    } else {
      // @ts-ignore
      this.city = this.myCitiesArray;
    }
    this.selectedCity = null;
    this.isLoad = true;
    this.isSearchCompleted = false;

  }

  private searchLocation(city) {
    this.httpService.searchLocationAuto(city).subscribe((data: CityModel[]) => {
      this.allCities = data;
      this.dataSource.data = this.allCities;
      this.isSearchCompleted = true;
      console.log(this.allCities);
    });
  }

  private navigateToWeatherPage(city) {
    this.transferService.Key.next(city.Key);
    this.router.navigate(['weather']);
  }

  private async loadLocationKey(key) {
    this.selectedCity = await this.httpService.searchLocationKey(key).pipe(map((data: CityModel) => data)).toPromise();
    console.log(this.selectedCity);
  }

  private async addCity(city) {
    let isFind = false;

    for (const c of this.myCitiesArray) {
      if (c.Key === city.Key) {
        isFind = true;
      }
    }

    if (!isFind) {
      this.citiesArr = new Array<CityModel>();
      if (this.myCitiesArray.length !== undefined) {
        this.citiesArr = this.myCitiesArray;
      } else {
        // @ts-ignore
        this.citiesArr.push(this.myCitiesArray);
      }
      await this.loadLocationKey(city.Key);
      this.citiesArr.push(this.selectedCity);
      this.myCitiesArray = this.citiesArr;
      console.log(this.citiesArr);
      localStorage.setItem('cities', JSON.stringify(this.citiesArr));
    }
  }

  private deleteCity(city: CityModel) {
    this.myCitiesArray.forEach(e => {
      if (e.Key === city.Key) {
        this.myCitiesArray.splice(this.myCitiesArray.indexOf(e), 1);
        localStorage.setItem('cities', JSON.stringify(this.myCitiesArray));
        return;
      }
    });
  }
}
