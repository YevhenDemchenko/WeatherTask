export class CityModel {
  Key: string;
  Type: string;
  Rank: number;
  LocalizedName: string;
  EnglishName: string;
  Region: RegionModel;
  Country: CountryModel;
}
export class RegionModel {
  ID: string;
  LocalizedName: string;
  EnglishName: string;
}
export class CountryModel {
  ID: string;
  LocalizedName: string;
  EnglishName: string;
}
