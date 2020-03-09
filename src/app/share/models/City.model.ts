export class CityModel {
  constructor(Key: string, LocalizedName: string, Country: CountryModel) {
    this.Key = Key;
    this.LocalizedName = LocalizedName;
    this.Country = Country;
  }

  Key: string;
  LocalizedName: string;
  Country: CountryModel;
}

interface CountryModel {
  LocalizedName: string;
}
