export interface CityPreset {
  id: string;
  name: string;
  state?: string;
  country: string;
  region?: 'West' | 'South' | 'Midwest' | 'Northeast' | 'Southwest' | 'Pacific' | 'International';
  coordinates: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
  };
  baselineAirTempF: number;
  baselineSurfaceTempF: number;
  description: string;
}

// -------------------------------------------------------------
// Comprehensive United States Metropolitan & Regional Cities Database
// -------------------------------------------------------------
export const US_CITIES: CityPreset[] = [
  // --- TOP US METROPOLISES ---
  {
    id: 'new-york-ny',
    name: 'New York City (Midtown / Downtown)',
    state: 'New York',
    country: 'United States',
    region: 'Northeast',
    coordinates: { longitude: -73.9851, latitude: 40.7484, zoom: 14.2, pitch: 58, bearing: -15 },
    baselineAirTempF: 89.2,
    baselineSurfaceTempF: 107.5,
    description: 'High-density asphalt & concrete corridor with acute 2m pedestrian thermal disparities during summer heatwaves.'
  },
  {
    id: 'los-angeles-ca',
    name: 'Los Angeles (Downtown / Koreatown)',
    state: 'California',
    country: 'United States',
    region: 'West',
    coordinates: { longitude: -118.2437, latitude: 34.0522, zoom: 14.2, pitch: 58, bearing: 25 },
    baselineAirTempF: 92.4,
    baselineSurfaceTempF: 114.8,
    description: 'Sprawling low-albedo urban basin with extensive heat entrapment across transit corridors and parking infrastructure.'
  },
  {
    id: 'chicago-il',
    name: 'Chicago (The Loop / River North)',
    state: 'Illinois',
    country: 'United States',
    region: 'Midwest',
    coordinates: { longitude: -87.6298, latitude: 41.8781, zoom: 14.5, pitch: 58, bearing: 0 },
    baselineAirTempF: 86.8,
    baselineSurfaceTempF: 104.2,
    description: 'High-rise skyscraper canyon with microclimate thermal channeling and heavy rooftop chiller peak loads.'
  },
  {
    id: 'houston-tx',
    name: 'Houston (Downtown / Galleria)',
    state: 'Texas',
    country: 'United States',
    region: 'South',
    coordinates: { longitude: -95.3698, latitude: 29.7604, zoom: 14.0, pitch: 58, bearing: -20 },
    baselineAirTempF: 96.5,
    baselineSurfaceTempF: 119.0,
    description: 'Subtropical high-humidity thermal basin with extreme building envelope air conditioning cooling loads.'
  },
  {
    id: 'phoenix-az',
    name: 'Phoenix (Downtown / Central Ave)',
    state: 'Arizona',
    country: 'United States',
    region: 'Southwest',
    coordinates: { longitude: -112.0740, latitude: 33.4484, zoom: 14.2, pitch: 58, bearing: 15 },
    baselineAirTempF: 108.5,
    baselineSurfaceTempF: 132.0,
    description: 'Extreme Sonoran desert urban heat island where 2m nighttime ambient air remains trapped above 90°F.'
  },
  {
    id: 'philadelphia-pa',
    name: 'Philadelphia (Center City)',
    state: 'Pennsylvania',
    country: 'United States',
    region: 'Northeast',
    coordinates: { longitude: -75.1652, latitude: 39.9526, zoom: 14.3, pitch: 58, bearing: 10 },
    baselineAirTempF: 88.0,
    baselineSurfaceTempF: 106.3,
    description: 'Historic masonry and asphalt grid with critical canopy deficits across inner-city residential blocks.'
  },
  {
    id: 'san-antonio-tx',
    name: 'San Antonio (Downtown / River Walk)',
    state: 'Texas',
    country: 'United States',
    region: 'South',
    coordinates: { longitude: -98.4936, latitude: 29.4241, zoom: 14.2, pitch: 58, bearing: -10 },
    baselineAirTempF: 97.2,
    baselineSurfaceTempF: 120.4,
    description: 'South Texas solar radiation corridor with high commercial roof albedo retrofit opportunities.'
  },
  {
    id: 'san-diego-ca',
    name: 'San Diego (Downtown / Gaslamp)',
    state: 'California',
    country: 'United States',
    region: 'West',
    coordinates: { longitude: -117.1611, latitude: 32.7157, zoom: 14.4, pitch: 58, bearing: -30 },
    baselineAirTempF: 82.5,
    baselineSurfaceTempF: 98.0,
    description: 'Coastal maritime climate with sharp inland thermal boundary gradients and solar roof potential.'
  },
  {
    id: 'dallas-tx',
    name: 'Dallas (Downtown / Arts District)',
    state: 'Texas',
    country: 'United States',
    region: 'South',
    coordinates: { longitude: -96.7970, latitude: 32.7767, zoom: 14.3, pitch: 58, bearing: 20 },
    baselineAirTempF: 98.6,
    baselineSurfaceTempF: 122.1,
    description: 'High-density commercial core subject to rapid summer heat accumulation and high chiller peak spikes.'
  },
  {
    id: 'austin-tx',
    name: 'Austin (Downtown / Congress Ave)',
    state: 'Texas',
    country: 'United States',
    region: 'South',
    coordinates: { longitude: -97.7431, latitude: 30.2672, zoom: 14.5, pitch: 58, bearing: 0 },
    baselineAirTempF: 97.8,
    baselineSurfaceTempF: 121.0,
    description: 'Fast-growing tech corridor with urgent cool roof and urban tree canopy expansion mandates.'
  },
  {
    id: 'san-jose-ca',
    name: 'San Jose (Silicon Valley Center)',
    state: 'California',
    country: 'United States',
    region: 'West',
    coordinates: { longitude: -121.8863, latitude: 37.3382, zoom: 14.0, pitch: 58, bearing: 15 },
    baselineAirTempF: 87.5,
    baselineSurfaceTempF: 106.0,
    description: 'Silicon Valley commercial campus clusters with massive industrial roof footprints ready for solar-reflective coatings.'
  },
  {
    id: 'san-francisco-ca',
    name: 'San Francisco (Financial District / SOMA)',
    state: 'California',
    country: 'United States',
    region: 'West',
    coordinates: { longitude: -122.4194, latitude: 37.7749, zoom: 14.2, pitch: 58, bearing: -20 },
    baselineAirTempF: 74.0,
    baselineSurfaceTempF: 89.5,
    description: 'Complex coastal microclimate where dense high-rises create dynamic localized heat pockets.'
  },
  {
    id: 'seattle-wa',
    name: 'Seattle (Downtown / Belltown)',
    state: 'Washington',
    country: 'United States',
    region: 'West',
    coordinates: { longitude: -122.3321, latitude: 47.6062, zoom: 14.2, pitch: 58, bearing: -15 },
    baselineAirTempF: 81.2,
    baselineSurfaceTempF: 96.0,
    description: 'Pacific Northwest urban center vulnerable to intensifying anomalous summer heat dome events.'
  },
  {
    id: 'denver-co',
    name: 'Denver (Downtown / LoDo)',
    state: 'Colorado',
    country: 'United States',
    region: 'West',
    coordinates: { longitude: -104.9903, latitude: 39.7392, zoom: 14.2, pitch: 58, bearing: 30 },
    baselineAirTempF: 91.0,
    baselineSurfaceTempF: 113.5,
    description: 'Mile-high high-altitude solar irradiance microclimate with rapid concrete surface heat absorption.'
  },
  {
    id: 'boston-ma',
    name: 'Boston (Back Bay / Financial District)',
    state: 'Massachusetts',
    country: 'United States',
    region: 'Northeast',
    coordinates: { longitude: -71.0589, latitude: 42.3601, zoom: 14.3, pitch: 58, bearing: -10 },
    baselineAirTempF: 85.5,
    baselineSurfaceTempF: 102.8,
    description: 'Dense historic street grid with high building thermal mass and acute pedestrian heat vulnerability.'
  },
  {
    id: 'miami-fl',
    name: 'Miami (Brickell / Downtown)',
    state: 'Florida',
    country: 'United States',
    region: 'South',
    coordinates: { longitude: -80.1918, latitude: 25.7617, zoom: 14.4, pitch: 58, bearing: 20 },
    baselineAirTempF: 93.0,
    baselineSurfaceTempF: 112.5,
    description: 'Tropical high-humidity corridor with continuous year-round HVAC chiller strain and high solar radiation.'
  },
  {
    id: 'atlanta-ga',
    name: 'Atlanta (Midtown / Downtown)',
    state: 'Georgia',
    country: 'United States',
    region: 'South',
    coordinates: { longitude: -84.3880, latitude: 33.7490, zoom: 14.2, pitch: 58, bearing: -5 },
    baselineAirTempF: 91.8,
    baselineSurfaceTempF: 111.0,
    description: 'Extensive tree canopy coverage contrasted with severe heat traps along transit and asphalt corridors.'
  },
  {
    id: 'las-vegas-nv',
    name: 'Las Vegas (The Strip / Downtown)',
    state: 'Nevada',
    country: 'United States',
    region: 'Southwest',
    coordinates: { longitude: -115.1728, latitude: 36.1147, zoom: 14.1, pitch: 58, bearing: 15 },
    baselineAirTempF: 106.8,
    baselineSurfaceTempF: 129.5,
    description: 'Hyper-arid Mojave basin with massive hospitality roof footprints and extreme day/night thermal retention.'
  },
  {
    id: 'portland-or',
    name: 'Portland (Downtown / Pearl District)',
    state: 'Oregon',
    country: 'United States',
    region: 'West',
    coordinates: { longitude: -122.6784, latitude: 45.5152, zoom: 14.3, pitch: 58, bearing: 0 },
    baselineAirTempF: 84.5,
    baselineSurfaceTempF: 99.8,
    description: 'Pioneering green infrastructure hub focusing on bioswales and cool roof albedo optimization.'
  },
  {
    id: 'washington-dc',
    name: 'Washington (National Mall / K Street)',
    state: 'District of Columbia',
    country: 'United States',
    region: 'Northeast',
    coordinates: { longitude: -77.0369, latitude: 38.9072, zoom: 14.2, pitch: 58, bearing: -10 },
    baselineAirTempF: 89.0,
    baselineSurfaceTempF: 108.0,
    description: 'Federal district corridor with broad paved avenues and significant pedestrian microclimate disparities.'
  },
  {
    id: 'nashville-tn',
    name: 'Nashville (Downtown / The Gulch)',
    state: 'Tennessee',
    country: 'United States',
    region: 'South',
    coordinates: { longitude: -86.7816, latitude: 36.1627, zoom: 14.3, pitch: 58, bearing: 15 },
    baselineAirTempF: 92.0,
    baselineSurfaceTempF: 110.5,
    description: 'Rapid commercial redevelopment corridor with high potential for cool roof coatings on new developments.'
  },
  {
    id: 'detroit-mi',
    name: 'Detroit (Downtown / Midtown)',
    state: 'Michigan',
    country: 'United States',
    region: 'Midwest',
    coordinates: { longitude: -83.0458, latitude: 42.3314, zoom: 14.2, pitch: 58, bearing: 20 },
    baselineAirTempF: 85.0,
    baselineSurfaceTempF: 102.5,
    description: 'Broad industrial and logistics corridors with extensive impervious pavement heat accumulation.'
  },
  {
    id: 'minneapolis-mn',
    name: 'Minneapolis (Downtown / North Loop)',
    state: 'Minnesota',
    country: 'United States',
    region: 'Midwest',
    coordinates: { longitude: -93.2650, latitude: 44.9778, zoom: 14.3, pitch: 58, bearing: -15 },
    baselineAirTempF: 83.8,
    baselineSurfaceTempF: 100.5,
    description: 'Northern urban corridor experiencing increased summer heatwave spikes and urban heat retention.'
  },
  {
    id: 'tampa-fl',
    name: 'Tampa (Downtown / Ybor City)',
    state: 'Florida',
    country: 'United States',
    region: 'South',
    coordinates: { longitude: -82.4572, latitude: 27.9506, zoom: 14.2, pitch: 58, bearing: -10 },
    baselineAirTempF: 93.5,
    baselineSurfaceTempF: 113.2,
    description: 'Gulf Coast high-humidity zone with intense solar thermal loading on commercial retail and logistics roofs.'
  },
  {
    id: 'orlando-fl',
    name: 'Orlando (Downtown / Theme Park Corridor)',
    state: 'Florida',
    country: 'United States',
    region: 'South',
    coordinates: { longitude: -81.3792, latitude: 28.5383, zoom: 14.1, pitch: 58, bearing: 10 },
    baselineAirTempF: 94.2,
    baselineSurfaceTempF: 115.0,
    description: 'High solar irradiance subtropical basin with extensive tourist infrastructure heat islands.'
  },
  {
    id: 'salt-lake-city-ut',
    name: 'Salt Lake City (Downtown)',
    state: 'Utah',
    country: 'United States',
    region: 'West',
    coordinates: { longitude: -111.8910, latitude: 40.7608, zoom: 14.2, pitch: 58, bearing: -15 },
    baselineAirTempF: 94.0,
    baselineSurfaceTempF: 117.0,
    description: 'Intermountain valley thermal basin where boundary layer heat traps accumulate between mountain ranges.'
  },
  {
    id: 'new-orleans-la',
    name: 'New Orleans (Central Business District / French Quarter)',
    state: 'Louisiana',
    country: 'United States',
    region: 'South',
    coordinates: { longitude: -90.0715, latitude: 29.9511, zoom: 14.5, pitch: 58, bearing: 25 },
    baselineAirTempF: 94.5,
    baselineSurfaceTempF: 113.8,
    description: 'Deltaic high-humidity urban fabric with dense historic architecture and localized air stagnation.'
  },
  {
    id: 'charlotte-nc',
    name: 'Charlotte (Uptown / South End)',
    state: 'North Carolina',
    country: 'United States',
    region: 'South',
    coordinates: { longitude: -80.8431, latitude: 35.2271, zoom: 14.3, pitch: 58, bearing: 10 },
    baselineAirTempF: 90.8,
    baselineSurfaceTempF: 109.5,
    description: 'Financial hub with towering corporate headquarters and heavy cooling load spikes during summer heatwaves.'
  },
  {
    id: 'raleigh-nc',
    name: 'Raleigh (Downtown / Research Triangle)',
    state: 'North Carolina',
    country: 'United States',
    region: 'South',
    coordinates: { longitude: -78.6382, latitude: 35.7796, zoom: 14.2, pitch: 58, bearing: -10 },
    baselineAirTempF: 89.5,
    baselineSurfaceTempF: 107.8,
    description: 'Research Triangle innovation center with large modern tech park campuses ripe for albedo upgrades.'
  },
  {
    id: 'san-bernardino-ca',
    name: 'San Bernardino (Inland Empire Hub)',
    state: 'California',
    country: 'United States',
    region: 'West',
    coordinates: { longitude: -117.2898, latitude: 34.1083, zoom: 14.0, pitch: 58, bearing: 15 },
    baselineAirTempF: 99.5,
    baselineSurfaceTempF: 124.0,
    description: 'Inland Empire logistics powerhouse containing hundreds of millions of square feet of dark warehouse roofs.'
  },
  {
    id: 'riverside-ca',
    name: 'Riverside (Downtown / University Ave)',
    state: 'California',
    country: 'United States',
    region: 'West',
    coordinates: { longitude: -117.3755, latitude: 33.9806, zoom: 14.1, pitch: 58, bearing: -20 },
    baselineAirTempF: 98.2,
    baselineSurfaceTempF: 122.5,
    description: 'Inland valley heat corridor with extreme summer daytime solar trapping and acute tree canopy deficits.'
  },
  {
    id: 'sacramento-ca',
    name: 'Sacramento (Capitol / Midtown)',
    state: 'California',
    country: 'United States',
    region: 'West',
    coordinates: { longitude: -121.4944, latitude: 38.5816, zoom: 14.3, pitch: 58, bearing: 0 },
    baselineAirTempF: 95.8,
    baselineSurfaceTempF: 118.4,
    description: 'Central Valley state capitol known as City of Trees, actively balancing canopy coverage with dark roof retrofits.'
  },
  {
    id: 'fresno-ca',
    name: 'Fresno (Downtown / Tower District)',
    state: 'California',
    country: 'United States',
    region: 'West',
    coordinates: { longitude: -119.7871, latitude: 36.7468, zoom: 14.0, pitch: 58, bearing: 10 },
    baselineAirTempF: 101.2,
    baselineSurfaceTempF: 126.0,
    description: 'Central Valley agricultural and commercial hub with sustained summer temperatures exceeding 100°F.'
  },
  {
    id: 'tucson-az',
    name: 'Tucson (Downtown / University)',
    state: 'Arizona',
    country: 'United States',
    region: 'Southwest',
    coordinates: { longitude: -110.9747, latitude: 32.2226, zoom: 14.2, pitch: 58, bearing: -15 },
    baselineAirTempF: 104.5,
    baselineSurfaceTempF: 128.0,
    description: 'High-desert basin with high solar radiation and extreme nighttime radiative heat retention.'
  },
  {
    id: 'albuquerque-nm',
    name: 'Albuquerque (Downtown / Nob Hill)',
    state: 'New Mexico',
    country: 'United States',
    region: 'Southwest',
    coordinates: { longitude: -106.6504, latitude: 35.0844, zoom: 14.1, pitch: 58, bearing: 20 },
    baselineAirTempF: 93.0,
    baselineSurfaceTempF: 115.5,
    description: 'Rio Grande high-elevation desert corridor with strong solar irradiance and high cool roof ROI.'
  },
  {
    id: 'cleveland-oh',
    name: 'Cleveland (Downtown / Flats)',
    state: 'Ohio',
    country: 'United States',
    region: 'Midwest',
    coordinates: { longitude: -81.6944, latitude: 41.4993, zoom: 14.2, pitch: 58, bearing: -10 },
    baselineAirTempF: 84.0,
    baselineSurfaceTempF: 101.5,
    description: 'Lake Erie urban shoreline with heavy industrial rooftops and significant pedestrian heat islands.'
  },
  {
    id: 'columbus-oh',
    name: 'Columbus (Downtown / Short North)',
    state: 'Ohio',
    country: 'United States',
    region: 'Midwest',
    coordinates: { longitude: -82.9988, latitude: 39.9612, zoom: 14.3, pitch: 58, bearing: 15 },
    baselineAirTempF: 86.5,
    baselineSurfaceTempF: 104.0,
    description: 'Rapidly growing Midwest capital city with active municipal sustainability and cool pavement initiatives.'
  },
  {
    id: 'indianapolis-in',
    name: 'Indianapolis (Monument Circle)',
    state: 'Indiana',
    country: 'United States',
    region: 'Midwest',
    coordinates: { longitude: -86.1581, latitude: 39.7684, zoom: 14.4, pitch: 58, bearing: 0 },
    baselineAirTempF: 87.2,
    baselineSurfaceTempF: 105.0,
    description: 'Sprawling Midwestern hub with extensive surface parking lots and commercial dark roofs.'
  },
  {
    id: 'kansas-city-mo',
    name: 'Kansas City (Downtown / Crossroads)',
    state: 'Missouri',
    country: 'United States',
    region: 'Midwest',
    coordinates: { longitude: -94.5786, latitude: 39.0997, zoom: 14.2, pitch: 58, bearing: 25 },
    baselineAirTempF: 90.0,
    baselineSurfaceTempF: 109.0,
    description: 'Heartland metropolitan center with major logistics hubs and significant urban heat disparities.'
  },
  {
    id: 'st-louis-mo',
    name: 'St. Louis (Downtown / Gateway Arch)',
    state: 'Missouri',
    country: 'United States',
    region: 'Midwest',
    coordinates: { longitude: -90.1994, latitude: 38.6270, zoom: 14.3, pitch: 58, bearing: -20 },
    baselineAirTempF: 90.5,
    baselineSurfaceTempF: 110.0,
    description: 'Mississippi river corridor with dense brick architecture and substantial heat island effects.'
  },
  {
    id: 'baltimore-md',
    name: 'Baltimore (Inner Harbor / Downtown)',
    state: 'Maryland',
    country: 'United States',
    region: 'Northeast',
    coordinates: { longitude: -76.6122, latitude: 39.2904, zoom: 14.4, pitch: 58, bearing: 15 },
    baselineAirTempF: 88.5,
    baselineSurfaceTempF: 107.0,
    description: 'Dense rowhouse city with stark intra-neighborhood surface temperature disparities.'
  },
  {
    id: 'pittsburgh-pa',
    name: 'Pittsburgh (Downtown Golden Triangle)',
    state: 'Pennsylvania',
    country: 'United States',
    region: 'Northeast',
    coordinates: { longitude: -79.9959, latitude: 40.4406, zoom: 14.4, pitch: 58, bearing: -25 },
    baselineAirTempF: 84.8,
    baselineSurfaceTempF: 102.0,
    description: 'Three-rivers valley topography with compact skyscraper canyon and localized heat trapping.'
  },
  {
    id: 'honolulu-hi',
    name: 'Honolulu (Downtown / Waikiki)',
    state: 'Hawaii',
    country: 'United States',
    region: 'Pacific',
    coordinates: { longitude: -157.8583, latitude: 21.3069, zoom: 14.2, pitch: 58, bearing: 20 },
    baselineAirTempF: 88.5,
    baselineSurfaceTempF: 105.0,
    description: 'Tropical high-rise resort corridor with intense year-round trade-wind and solar thermal dynamics.'
  },
  {
    id: 'anchorage-ak',
    name: 'Anchorage (Downtown)',
    state: 'Alaska',
    country: 'United States',
    region: 'West',
    coordinates: { longitude: -149.9003, latitude: 61.2181, zoom: 14.0, pitch: 58, bearing: -10 },
    baselineAirTempF: 70.5,
    baselineSurfaceTempF: 82.0,
    description: 'Subarctic urban center monitoring increasing summer temperature anomalies and roof thermal efficiency.'
  },

  // --- INTERNATIONAL SHOWCASE HUBS ---
  {
    id: 'abu-dhabi',
    name: 'Abu Dhabi (Masdar City / Corniche)',
    country: 'United Arab Emirates',
    region: 'International',
    coordinates: { longitude: 54.6186, latitude: 24.4267, zoom: 14.5, pitch: 58, bearing: -20 },
    baselineAirTempF: 104.2,
    baselineSurfaceTempF: 122.5,
    description: 'High solar irradiance desert microclimate with heavy urban albedo trapping and active construction projects.'
  },
  {
    id: 'dubai',
    name: 'Dubai (Downtown / Business Bay)',
    country: 'United Arab Emirates',
    region: 'International',
    coordinates: { longitude: 55.2708, latitude: 25.1972, zoom: 14.2, pitch: 58, bearing: 35 },
    baselineAirTempF: 102.8,
    baselineSurfaceTempF: 119.4,
    description: 'Dense high-rise corridor with extreme urban canyon heat trapping and high chiller electricity load.'
  },
  {
    id: 'riyadh',
    name: 'Riyadh (KAFD / Olaya)',
    country: 'Saudi Arabia',
    region: 'International',
    coordinates: { longitude: 46.6575, latitude: 24.7645, zoom: 14.2, pitch: 58, bearing: 10 },
    baselineAirTempF: 109.1,
    baselineSurfaceTempF: 129.3,
    description: 'Hyper-arid metropolitan basin with critical concrete curing evaporation rates and massive cool roof ROI.'
  }
];

export const CITY_PRESETS = US_CITIES;

// Helper to filter US cities by text query
export function searchCities(query: string): CityPreset[] {
  if (!query || query.trim() === '') return US_CITIES.slice(0, 15);
  const q = query.toLowerCase().trim();
  return US_CITIES.filter(c => 
    c.name.toLowerCase().includes(q) ||
    (c.state && c.state.toLowerCase().includes(q)) ||
    c.country.toLowerCase().includes(q) ||
    (c.region && c.region.toLowerCase().includes(q))
  );
}

// Helper to create a dynamic city preset on the fly from geocoding
export function createDynamicCityPreset(
  name: string,
  state: string = 'USA',
  lat: number,
  lng: number,
  baseTempF: number = 90.0
): CityPreset {
  const id = `custom-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.round(lat * 100)}`;
  return {
    id,
    name: `${name}, ${state}`,
    state,
    country: 'United States',
    region: 'West',
    coordinates: {
      longitude: lng,
      latitude: lat,
      zoom: 14.3,
      pitch: 58,
      bearing: -15
    },
    baselineAirTempF: baseTempF,
    baselineSurfaceTempF: baseTempF + 18.5,
    description: `Dynamic US microclimate digital twin for ${name}, ${state}.`
  };
}

// Color ramp interpolation for 2m ambient thermal heatmaps
export function getThermalColorRgba(tempF: number, minF: number = 80, maxF: number = 115): [number, number, number, number] {
  const normalized = Math.min(1, Math.max(0, (tempF - minF) / (maxF - minF)));
  
  if (normalized < 0.35) {
    const t = normalized / 0.35;
    return [Math.round(0 + t * 144), Math.round(180 + t * 44), Math.round(216 - t * 156), 195];
  } else if (normalized < 0.7) {
    const t = (normalized - 0.35) / 0.35;
    return [Math.round(144 + t * 111), Math.round(224 - t * 66), Math.round(60 - t * 60), 210];
  } else {
    const t = (normalized - 0.7) / 0.3;
    return [Math.round(255 - t * 47), Math.round(158 - t * 158), Math.round(0), 225];
  }
}
