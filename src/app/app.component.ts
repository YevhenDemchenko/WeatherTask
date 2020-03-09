import {Component, OnDestroy, OnInit} from '@angular/core';
import {CityModel} from './share/models/City.model';
import {HttpService} from './share/http.service';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private httpService: HttpService) { }

  title = 'weatherTask';
  citiesArr = new Array<CityModel>();
  language: string;

  observableLocationByIp: Observable<CityModel>;

  locationByIpSubscriptions: Subscription = new Subscription();

  ngOnInit() {
    this.language = localStorage.getItem('language');

    if (this.language === null) {
      this.language = 'ru';
      localStorage.setItem('language', this.language);
    }

    if (localStorage.getItem('cities') === null) {
      this.getLocationByIp();
    }
  }

  changeLanguage() {
    localStorage.setItem('language', this.language);
    window.location.reload();
  }

  private getLocationByIp() {
    this.observableLocationByIp = this.httpService.getLocationByIp();
    this.locationByIpSubscriptions = this.observableLocationByIp.subscribe({
      next: (data: CityModel) => {
        this.citiesArr.push(new CityModel(data.Key, data.LocalizedName, data.Country));
      },
      complete: () => {
        localStorage.setItem('cities', JSON.stringify(this.citiesArr));
      },
      error: error => console.error('There was an error!', error)
    });
  }

  ngOnDestroy() {
    this.locationByIpSubscriptions.unsubscribe();
  }
}
