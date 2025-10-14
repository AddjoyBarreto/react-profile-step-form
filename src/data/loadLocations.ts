export type City = { code: string; name: string };
export type State = { code: string; name: string; cities: City[] };
export type Country = { code: string; name: string; states: State[] };

function toCode(input: string | number | undefined, fallbackName: string): string {
  if (typeof input === 'string' && input.trim()) return input.trim();
  if (typeof input === 'number') return String(input);
  return fallbackName.trim().toUpperCase().replace(/\s+/g, '_');
}

export async function loadLocations(): Promise<Country[]> {
  const mod: any = await import('./countries+states+cities.json');
  const raw = mod.default ?? mod;
  const countriesArr: any[] = Array.isArray(raw) ? raw : Array.isArray(raw?.countries) ? raw.countries : [];

  const countries: Country[] = countriesArr.map((c: any) => {
    const countryName: string = c.name || c.country || c.country_name || 'Unknown';
    const countryCode: string = toCode(c.iso2 || c.iso3 || c.code, countryName);
    const statesArr: any[] = Array.isArray(c.states) ? c.states : Array.isArray(c.statesProvinces) ? c.statesProvinces : [];

    const states: State[] = statesArr.map((s: any) => {
      const stateName: string = s.name || s.state || s.state_name || 'Unknown';
      const stateCode: string = toCode(s.state_code || s.code || s.iso2, stateName);
      const citiesArr: any[] = Array.isArray(s.cities) ? s.cities : Array.isArray(s.city) ? s.city : [];
      const cities: City[] = citiesArr.map((ci: any) => {
        const cityName: string = ci.name || ci.city || 'Unknown';
        const cityCode: string = toCode(ci.id || ci.geonameid || ci.code, cityName);
        return { code: cityCode, name: cityName };
      });
      return { code: stateCode, name: stateName, cities };
    });

    return { code: countryCode, name: countryName, states };
  });

  return countries;
}
