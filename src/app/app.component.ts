import {Component, OnDestroy, OnInit} from '@angular/core';
import {CityModel} from './share/models/City.model';
import {HttpService} from './share/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private httpService: HttpService) { }

  title = 'weatherTask';
  city: CityModel;
  key = 325825;

  ngOnInit() {
    if (localStorage.getItem('cities') === null) {
      this.httpService.searchLocationKey(this.key).subscribe((data: CityModel) => {
        this.city = data;
        localStorage.setItem('cities', JSON.stringify(this.city));
      });
    }
  }

  ngOnDestroy() {
  }
}
