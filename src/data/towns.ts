import { TOWNS_DATA_1 } from './towns_data_1';
import { TOWNS_DATA_2 } from './towns_data_2';
import { TOWNS_DATA_3 } from './towns_data_3';

export interface Town {
  year: number;
  municipality: string;
  type: string;
  county: string;
  lat: number;
  lng: number;
}

const ALL_COMPACT_DATA = [
  ...TOWNS_DATA_1,
  ...TOWNS_DATA_2,
  ...TOWNS_DATA_3
];

export const NJ_TOWNS: Town[] = ALL_COMPACT_DATA.map(([municipality, type, county, year, lat, lng]) => ({
  municipality,
  type,
  county,
  year,
  lat,
  lng
})).sort((a, b) => a.year - b.year);
