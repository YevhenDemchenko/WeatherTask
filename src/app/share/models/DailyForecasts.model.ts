export class DailyForecastsModel {
  Date: string;
  Temperature: TemperatureModel;
  Day: DayModel;
  Night: DayModel;
  WeatherIcon: number;
  IsDayTime: boolean;
}
export class TemperatureModel {
  Minimum: MinMaxModel;
  Maximum: MinMaxModel;
}
class MinMaxModel {
  Value: number;
  Unit: string;
  UnitType: number;
}
class DayModel {
  Icon: number;
  IconPhrase: string;
  HasPrecipitation: boolean;
}
