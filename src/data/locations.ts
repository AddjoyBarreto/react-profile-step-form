export type City = { code: string; name: string };
export type State = { code: string; name: string; cities: City[] };
export type Country = { code: string; name: string; states: State[] };

export const COUNTRIES: Country[] = [
  {
    code: 'US',
    name: 'United States',
    states: [
      { code: 'CA', name: 'California', cities: [ { code: 'SFO', name: 'San Francisco' }, { code: 'LA', name: 'Los Angeles' } ] },
      { code: 'NY', name: 'New York', cities: [ { code: 'NYC', name: 'New York City' }, { code: 'BUF', name: 'Buffalo' } ] },
    ],
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    states: [
      { code: 'DU', name: 'Dubai', cities: [ { code: 'DXB', name: 'Dubai' } ] },
      { code: 'AD', name: 'Abu Dhabi', cities: [ { code: 'AUH', name: 'Abu Dhabi' } ] },
    ],
  },
];
