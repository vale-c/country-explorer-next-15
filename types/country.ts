export interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  cca3: string;
  capital: string[];
  region: string;
  subregion: string;
  population: number;
  area: number;
  flags: {
    png: string;
    svg: string;
  };
  languages: {
    [key: string]: string;
  };
  currencies: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  translations: {
    [key: string]: {
      official: string;
      common: string;
    };
  };
  borders?: string[];
  timezones?: string[];
  osmId?: string;
  latlng?: [number, number];
  landlocked: boolean;
  car?: {
    side: string;
  };
  tld?: string[];
}
