import {Component, OnDestroy, OnInit} from '@angular/core';
import {CityModel} from './share/models/City.model';
import {HttpService} from './share/http.service';
import {map} from 'rxjs/operators';

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

  async ngOnInit() {
    if (localStorage.getItem('cities') === null) {
      this.city = await this.httpService.searchLocationKey(this.key).pipe(map((data: CityModel) => data)).toPromise();
      localStorage.setItem('cities', JSON.stringify(this.city));
    }
  }

  ngOnDestroy() {
  }
}
