export class CurrentConditionsModel {
  LocalObservationDateTime: number;
  WeatherText: string;
  WeatherIcon: number;
  IsDayTime: boolean;
  Temperature: TemperatureModel;
}
class TemperatureModel {
  Metric: MetricModel;
}

export class MetricModel {
  Value: number;
  Unit: string;
  UnitType: number;
}
