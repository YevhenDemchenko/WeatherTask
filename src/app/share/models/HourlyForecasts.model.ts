export class HourlyForecastsModel {
  Key: string;
  EnglishName: string;
  DateTime: string;
  IconPhrase: boolean;
  Temperature: TemperatureModel;
  WeatherIcon: number;
}
class TemperatureModel {
  Value: number;
}
