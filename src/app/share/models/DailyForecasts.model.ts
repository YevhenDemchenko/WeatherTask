export class ForecastDay {
  constructor(Date: string, Temperature: TemperatureModel, Day: DayModel, Night: DayModel) {
    this.Date = Date;
    this.Temperature = Temperature;
    this.Day = Day;
    this.Night = Night;
  }
  Date: string;
  Temperature: TemperatureModel;
  Day: DayModel;
  Night: DayModel;
}
export class TemperatureModel {
  Minimum: MinMaxModel;
  Maximum: MinMaxModel;
}
class MinMaxModel {
  Value: number;
  Unit: string;
}
class DayModel {
  Icon: number;
  IconPhrase: string;
}
export class DailyForecastsModel {
  Headline: any;
  DailyForecasts: ForecastDay[];
}
