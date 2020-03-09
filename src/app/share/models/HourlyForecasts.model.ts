export class HourlyForecastsModel {
  constructor(Key: string, DateTime: string, IconPhrase: boolean, Temperature: TemperatureModel, WeatherIcon: number) {
    this.Key = Key;
    this.DateTime = DateTime;
    this.IconPhrase = IconPhrase;
    this.Temperature = Temperature;
    this.WeatherIcon = WeatherIcon;
  }

  Key: string;
  DateTime: string;
  IconPhrase: boolean;
  Temperature: TemperatureModel;
  WeatherIcon: number;
}
interface TemperatureModel {
  Value: number;
  Unit: string;
}
