import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {HttpService} from '../share/http.service';
import {CityModel} from '../share/models/City.model';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {TransferService} from '../share/transfer.service';
import {Subscription} from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-myCities',
  templateUrl: './myCities.component.html',
  styleUrls: ['./myCities.component.scss']
})
export class MyCitiesComponent implements OnInit, OnDestroy {

  constructor(private httpService: HttpService, private router: Router, private transferService: TransferService) {
  }
  myCitiesArray: Array<CityModel>;
  citiesArr = new Array<CityModel>();

  searchLocationAutoSubscription: Subscription = new Subscription();

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['LocalizedName', 'Country', 'AdministrativeArea', 'button'];

  selectedCity: CityModel;
  city: CityModel[];
  key = '325825';

  isLoad: boolean;
  isSearchCompleted: boolean;

  async ngOnInit() {
    this.myCitiesArray = JSON.parse(localStorage.getItem('cities'));

    this.city = this.myCitiesArray;

    this.selectedCity = null;
    if (this.myCitiesArray === null) {
      this.myCitiesArray = await this.httpService.searchLocationKey(this.key).pipe(map((data: CityModel[]) => data)).toPromise();
      this.city = this.myCitiesArray;
    }
    this.isLoad = true;
    this.isSearchCompleted = false;
  }

  private searchLocation(city) {
    this.searchLocationAutoSubscription = this.httpService.searchLocationAuto(city).subscribe((data: CityModel[]) => {
      this.dataSource.data = data;
      this.isSearchCompleted = true;
    });
  }

  private navigateToWeatherPage(city) {
    this.transferService.Key.next(city.Key);
    this.router.navigate(['weather']);
  }

  private async loadLocationKey(key) {
    this.selectedCity = await this.httpService.searchLocationKey(key).pipe(map((data: CityModel) => data)).toPromise();
  }

  private async addCity(city) {
    let isFind = false;

    if (this.myCitiesArray.length === null) {
      for (const c of this.myCitiesArray) {
        if (c.Key === city.Key) {
          isFind = true;
        }
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

  ngOnDestroy() {
    this.searchLocationAutoSubscription.unsubscribe();
  }
}
