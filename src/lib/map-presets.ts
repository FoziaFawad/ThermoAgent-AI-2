export interface CityPreset {
  id: string;
  name: string;
  subtitle?: string;
  state?: string;
  country: string;
  category?: 'landmark' | 'neighborhood' | 'street' | 'city' | 'district';
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
// Granular In-City Neighborhoods, Districts & Landmarks Database
// -------------------------------------------------------------
export const IN_CITY_LOCATIONS: CityPreset[] = [
  // === NEW YORK CITY IN-DEPTH LOCATIONS ===
  {
    id: 'nyc-times-square',
    name: 'Times Square & Broadway',
    subtitle: 'Midtown Manhattan, New York, NY',
    state: 'New York',
    country: 'United States',
    category: 'landmark',
    region: 'Northeast',
    coordinates: { longitude: -73.9855, latitude: 40.7580, zoom: 16.5, pitch: 60, bearing: -28 },
    baselineAirTempF: 92.5,
    baselineSurfaceTempF: 114.0,
    description: 'Ultra-high density electronic billboard & pedestrian canyon with extreme radiative boundary layer entrapment.'
  },
  {
    id: 'nyc-empire-state',
    name: 'Empire State Building & 34th St',
    subtitle: 'Midtown South, Manhattan, NY',
    state: 'New York',
    country: 'United States',
    category: 'landmark',
    region: 'Northeast',
    coordinates: { longitude: -73.9857, latitude: 40.7484, zoom: 16.5, pitch: 60, bearing: 20 },
    baselineAirTempF: 90.8,
    baselineSurfaceTempF: 109.5,
    description: 'Iconic skyscraper canyon with severe concrete thermal mass retention and high HVAC chiller exhaust.'
  },
  {
    id: 'nyc-wall-street',
    name: 'Wall Street & Financial District',
    subtitle: 'Lower Manhattan, New York, NY',
    state: 'New York',
    country: 'United States',
    category: 'neighborhood',
    region: 'Northeast',
    coordinates: { longitude: -74.0090, latitude: 40.7075, zoom: 16.4, pitch: 60, bearing: 15 },
    baselineAirTempF: 89.5,
    baselineSurfaceTempF: 106.8,
    description: 'Narrow historic skyscraper chasms with localized microclimate solar shadowing and asphalt heat sinks.'
  },
  {
    id: 'nyc-central-park-south',
    name: 'Central Park South & 59th St',
    subtitle: 'Billionaires\' Row, Manhattan, NY',
    state: 'New York',
    country: 'United States',
    category: 'neighborhood',
    region: 'Northeast',
    coordinates: { longitude: -73.9772, latitude: 40.7663, zoom: 16.2, pitch: 60, bearing: -10 },
    baselineAirTempF: 85.0,
    baselineSurfaceTempF: 98.2,
    description: 'Sharp thermal boundary interface between urban vegetative cooling buffers and supertall dark roof high-rises.'
  },
  {
    id: 'nyc-hudson-yards',
    name: 'Hudson Yards & The Vessel',
    subtitle: 'West Side Manhattan, New York, NY',
    state: 'New York',
    country: 'United States',
    category: 'district',
    region: 'Northeast',
    coordinates: { longitude: -74.0022, latitude: 40.7538, zoom: 16.5, pitch: 60, bearing: -35 },
    baselineAirTempF: 88.2,
    baselineSurfaceTempF: 105.0,
    description: 'Modern glass-steel architectural platform built over rail yards with massive commercial cooling infrastructure.'
  },
  {
    id: 'nyc-brooklyn-bridge-dumbo',
    name: 'Brooklyn Bridge & DUMBO',
    subtitle: 'Brooklyn Waterfront, New York, NY',
    state: 'New York',
    country: 'United States',
    category: 'landmark',
    region: 'Northeast',
    coordinates: { longitude: -73.9935, latitude: 40.7042, zoom: 16.2, pitch: 60, bearing: 45 },
    baselineAirTempF: 87.5,
    baselineSurfaceTempF: 103.0,
    description: 'Cobblestone historic warehouse district with high dark roof footprint and maritime thermal airflow.'
  },
  {
    id: 'nyc-soho',
    name: 'SoHo & Cast Iron District',
    subtitle: 'Lower Manhattan, New York, NY',
    state: 'New York',
    country: 'United States',
    category: 'neighborhood',
    region: 'Northeast',
    coordinates: { longitude: -73.9995, latitude: 40.7233, zoom: 16.2, pitch: 60, bearing: 0 },
    baselineAirTempF: 90.0,
    baselineSurfaceTempF: 108.5,
    description: 'Cast-iron facade architectural blocks with low canopy coverage and high roof coating retrofit potential.'
  },
  {
    id: 'nyc-williamsburg',
    name: 'Williamsburg Bedford Ave Corridor',
    subtitle: 'Brooklyn, New York, NY',
    state: 'New York',
    country: 'United States',
    category: 'neighborhood',
    region: 'Northeast',
    coordinates: { longitude: -73.9570, latitude: 40.7180, zoom: 15.8, pitch: 60, bearing: -15 },
    baselineAirTempF: 89.0,
    baselineSurfaceTempF: 107.0,
    description: 'High-density mixed-use corridor with dark flat rooftops and intense summer pedestrian foot traffic.'
  },

  // === LOS ANGELES IN-DEPTH LOCATIONS ===
  {
    id: 'la-downtown-financial',
    name: 'Downtown LA Financial & Crypto Arena',
    subtitle: 'Bunker Hill / DTLA, Los Angeles, CA',
    state: 'California',
    country: 'United States',
    category: 'district',
    region: 'West',
    coordinates: { longitude: -118.2580, latitude: 34.0490, zoom: 16.2, pitch: 60, bearing: 35 },
    baselineAirTempF: 94.0,
    baselineSurfaceTempF: 118.5,
    description: 'High-rise concrete core with massive underground and rooftop chiller heat discharges.'
  },
  {
    id: 'la-santa-monica-pier',
    name: 'Santa Monica Pier & Ocean Ave',
    subtitle: 'Santa Monica, Los Angeles, CA',
    state: 'California',
    country: 'United States',
    category: 'landmark',
    region: 'West',
    coordinates: { longitude: -118.4960, latitude: 34.0100, zoom: 16.0, pitch: 60, bearing: -45 },
    baselineAirTempF: 78.5,
    baselineSurfaceTempF: 92.0,
    description: 'Coastal thermal boundary buffer with high tourist foot traffic and marine layer wind dissipation.'
  },
  {
    id: 'la-hollywood-blvd',
    name: 'Hollywood Blvd & Walk of Fame',
    subtitle: 'Hollywood, Los Angeles, CA',
    state: 'California',
    country: 'United States',
    category: 'street',
    region: 'West',
    coordinates: { longitude: -118.3268, latitude: 34.1016, zoom: 16.2, pitch: 60, bearing: 0 },
    baselineAirTempF: 93.8,
    baselineSurfaceTempF: 116.0,
    description: 'Low-albedo dark terrazzo asphalt corridor with severe pedestrian solar radiation exposure.'
  },
  {
    id: 'la-venice-beach',
    name: 'Venice Beach Boardwalk & Canals',
    subtitle: 'Venice, Los Angeles, CA',
    state: 'California',
    country: 'United States',
    category: 'neighborhood',
    region: 'West',
    coordinates: { longitude: -118.4695, latitude: 33.9850, zoom: 15.8, pitch: 60, bearing: 20 },
    baselineAirTempF: 80.2,
    baselineSurfaceTempF: 95.0,
    description: 'High solar exposure pedestrian boardwalk with rapid surface heating on asphalt parking zones.'
  },
  {
    id: 'la-century-city',
    name: 'Century City & Beverly Hills Center',
    subtitle: 'Westside Los Angeles, CA',
    state: 'California',
    country: 'United States',
    category: 'district',
    region: 'West',
    coordinates: { longitude: -118.4160, latitude: 34.0580, zoom: 16.0, pitch: 60, bearing: -20 },
    baselineAirTempF: 88.5,
    baselineSurfaceTempF: 108.0,
    description: 'High-profile commercial high-rise cluster with massive reflective glass towers and commercial retail roofs.'
  },
  {
    id: 'la-pasadena-old-town',
    name: 'Pasadena Old Town & Colorado Blvd',
    subtitle: 'San Gabriel Valley, CA',
    state: 'California',
    country: 'United States',
    category: 'neighborhood',
    region: 'West',
    coordinates: { longitude: -118.1500, latitude: 34.1458, zoom: 15.8, pitch: 60, bearing: 15 },
    baselineAirTempF: 98.0,
    baselineSurfaceTempF: 122.0,
    description: 'Inland valley thermal basin experiencing extreme summer daytime heat accumulation.'
  },

  // === MIAMI IN-DEPTH LOCATIONS ===
  {
    id: 'miami-brickell',
    name: 'Brickell Financial District',
    subtitle: 'Brickell Ave / Downtown, Miami, FL',
    state: 'Florida',
    country: 'United States',
    category: 'district',
    region: 'South',
    coordinates: { longitude: -80.1918, latitude: 25.7617, zoom: 16.5, pitch: 60, bearing: 25 },
    baselineAirTempF: 94.5,
    baselineSurfaceTempF: 115.0,
    description: 'Dense residential & banking skyscraper canyon with constant year-round chiller cooling loads.'
  },
  {
    id: 'miami-south-beach-ocean-drive',
    name: 'South Beach & Ocean Drive',
    subtitle: 'Miami Beach, FL',
    state: 'Florida',
    country: 'United States',
    category: 'street',
    region: 'South',
    coordinates: { longitude: -80.1310, latitude: 25.7820, zoom: 16.2, pitch: 60, bearing: -15 },
    baselineAirTempF: 91.8,
    baselineSurfaceTempF: 110.0,
    description: 'Historic Art Deco architectural strip with high solar exposure and coastal humidity.'
  },
  {
    id: 'miami-wynwood',
    name: 'Wynwood Arts District',
    subtitle: 'NW 2nd Ave / Midtown, Miami, FL',
    state: 'Florida',
    country: 'United States',
    category: 'neighborhood',
    region: 'South',
    coordinates: { longitude: -80.1990, latitude: 25.8000, zoom: 16.0, pitch: 60, bearing: 0 },
    baselineAirTempF: 95.2,
    baselineSurfaceTempF: 118.5,
    description: 'Low-rise concrete warehouse district with extensive dark flat roofs and acute canopy deficits.'
  },

  // === CHICAGO IN-DEPTH LOCATIONS ===
  {
    id: 'chicago-the-loop',
    name: 'The Loop & Willis Tower',
    subtitle: 'Downtown Financial Center, Chicago, IL',
    state: 'Illinois',
    country: 'United States',
    category: 'district',
    region: 'Midwest',
    coordinates: { longitude: -87.6298, latitude: 41.8781, zoom: 16.4, pitch: 60, bearing: 0 },
    baselineAirTempF: 88.0,
    baselineSurfaceTempF: 106.0,
    description: 'Historic dense skyscraper grid with wind-channeled urban heat entrapment.'
  },
  {
    id: 'chicago-magnificent-mile',
    name: 'Magnificent Mile & Michigan Ave',
    subtitle: 'Near North Side, Chicago, IL',
    state: 'Illinois',
    country: 'United States',
    category: 'street',
    region: 'Midwest',
    coordinates: { longitude: -87.6240, latitude: 41.8950, zoom: 16.5, pitch: 60, bearing: -20 },
    baselineAirTempF: 86.5,
    baselineSurfaceTempF: 103.5,
    description: 'Premier commercial shopping canyon with high thermal mass and massive commercial cooling demand.'
  },
  {
    id: 'chicago-fulton-market',
    name: 'Fulton Market & West Loop',
    subtitle: 'West Loop Tech Corridor, Chicago, IL',
    state: 'Illinois',
    country: 'United States',
    category: 'neighborhood',
    region: 'Midwest',
    coordinates: { longitude: -87.6520, latitude: 41.8860, zoom: 16.0, pitch: 60, bearing: 15 },
    baselineAirTempF: 88.5,
    baselineSurfaceTempF: 107.0,
    description: 'Fastest growing converted industrial tech district with high dark roof density.'
  },

  // === SAN FRANCISCO IN-DEPTH LOCATIONS ===
  {
    id: 'sf-financial-district',
    name: 'Financial District & Salesforce Tower',
    subtitle: 'Downtown / Transbay, San Francisco, CA',
    state: 'California',
    country: 'United States',
    category: 'district',
    region: 'West',
    coordinates: { longitude: -122.3999, latitude: 37.7946, zoom: 16.5, pitch: 60, bearing: -30 },
    baselineAirTempF: 76.5,
    baselineSurfaceTempF: 92.0,
    description: 'Towering commercial high-rises with strong microclimate thermal variations between sheltered street canyons.'
  },
  {
    id: 'sf-union-square',
    name: 'Union Square & Market St Corridor',
    subtitle: 'Downtown San Francisco, CA',
    state: 'California',
    country: 'United States',
    category: 'landmark',
    region: 'West',
    coordinates: { longitude: -122.4075, latitude: 37.7879, zoom: 16.5, pitch: 60, bearing: 10 },
    baselineAirTempF: 75.8,
    baselineSurfaceTempF: 90.5,
    description: 'Dense retail core with high pedestrian density and historic commercial building envelopes.'
  },
  {
    id: 'sf-mission-district',
    name: 'Mission District & Valencia St',
    subtitle: 'The Mission, San Francisco, CA',
    state: 'California',
    country: 'United States',
    category: 'neighborhood',
    region: 'West',
    coordinates: { longitude: -122.4200, latitude: 37.7600, zoom: 15.8, pitch: 60, bearing: 0 },
    baselineAirTempF: 81.0,
    baselineSurfaceTempF: 97.5,
    description: 'Sunniest microclimate zone in SF with low vegetative cover and dark asphalt roofs.'
  },

  // === PHOENIX / SCOTTSDALE IN-DEPTH LOCATIONS ===
  {
    id: 'phx-downtown-central-ave',
    name: 'Downtown Phoenix & Central Ave Corridor',
    subtitle: 'Central City, Phoenix, AZ',
    state: 'Arizona',
    country: 'United States',
    category: 'district',
    region: 'Southwest',
    coordinates: { longitude: -112.0740, latitude: 33.4484, zoom: 16.2, pitch: 60, bearing: 15 },
    baselineAirTempF: 109.5,
    baselineSurfaceTempF: 134.0,
    description: 'Severe Sonoran desert heat island with pavement surface temps exceeding 150°F in direct sunlight.'
  },
  {
    id: 'phx-scottsdale-old-town',
    name: 'Scottsdale Old Town & Waterfront',
    subtitle: 'Scottsdale, AZ',
    state: 'Arizona',
    country: 'United States',
    category: 'neighborhood',
    region: 'Southwest',
    coordinates: { longitude: -111.9261, latitude: 33.4942, zoom: 16.0, pitch: 60, bearing: -10 },
    baselineAirTempF: 106.8,
    baselineSurfaceTempF: 129.0,
    description: 'High-end hospitality and retail center with active shade structure and cool misting deployments.'
  },
  {
    id: 'phx-tempe-mill-ave',
    name: 'Tempe Town Lake & Mill Ave',
    subtitle: 'Tempe / ASU Campus, AZ',
    state: 'Arizona',
    country: 'United States',
    category: 'neighborhood',
    region: 'Southwest',
    coordinates: { longitude: -111.9400, latitude: 33.4255, zoom: 16.0, pitch: 60, bearing: 20 },
    baselineAirTempF: 107.5,
    baselineSurfaceTempF: 130.5,
    description: 'University corridor with massive asphalt parking structures and pedestrian thermal vulnerability.'
  },

  // === AUSTIN IN-DEPTH LOCATIONS ===
  {
    id: 'atx-congress-capitol',
    name: 'Congress Ave & Texas State Capitol',
    subtitle: 'Downtown Austin, TX',
    state: 'Texas',
    country: 'United States',
    category: 'landmark',
    region: 'South',
    coordinates: { longitude: -97.7404, latitude: 30.2747, zoom: 16.5, pitch: 60, bearing: 0 },
    baselineAirTempF: 98.8,
    baselineSurfaceTempF: 123.0,
    description: 'Granite state capitol grounds framed by modern high-rises with significant solar reflection.'
  },
  {
    id: 'atx-rainey-street',
    name: 'Rainey Street Historic District',
    subtitle: 'East Austin Waterfront, TX',
    state: 'Texas',
    country: 'United States',
    category: 'neighborhood',
    region: 'South',
    coordinates: { longitude: -97.7380, latitude: 30.2580, zoom: 16.2, pitch: 60, bearing: 30 },
    baselineAirTempF: 97.5,
    baselineSurfaceTempF: 120.0,
    description: 'High-density residential towers replacing bungalow footprints with acute localized microclimate shifts.'
  },
  {
    id: 'atx-the-domain',
    name: 'The Domain Tech Hub',
    subtitle: 'North Austin, TX',
    state: 'Texas',
    country: 'United States',
    category: 'district',
    region: 'South',
    coordinates: { longitude: -97.7250, latitude: 30.4020, zoom: 15.8, pitch: 60, bearing: -15 },
    baselineAirTempF: 99.0,
    baselineSurfaceTempF: 124.0,
    description: 'Sprawling mixed-use tech campus with massive flat commercial roofs and expansive asphalt lots.'
  },

  // === SEATTLE IN-DEPTH LOCATIONS ===
  {
    id: 'sea-pike-place',
    name: 'Pike Place Market & Waterfront',
    subtitle: 'Downtown Seattle, WA',
    state: 'Washington',
    country: 'United States',
    category: 'landmark',
    region: 'West',
    coordinates: { longitude: -122.3422, latitude: 47.6097, zoom: 16.5, pitch: 60, bearing: -40 },
    baselineAirTempF: 82.0,
    baselineSurfaceTempF: 97.5,
    description: 'Historic multi-level wooden & brick market facing Puget Sound with intense tourist pedestrian traffic.'
  },
  {
    id: 'sea-space-needle',
    name: 'Space Needle & Seattle Center',
    subtitle: 'Lower Queen Anne, Seattle, WA',
    state: 'Washington',
    country: 'United States',
    category: 'landmark',
    region: 'West',
    coordinates: { longitude: -122.3493, latitude: 47.6205, zoom: 16.5, pitch: 60, bearing: 15 },
    baselineAirTempF: 81.5,
    baselineSurfaceTempF: 96.0,
    description: 'Iconic tower campus surrounded by large arena roofs and cultural pavilion structures.'
  },
  {
    id: 'sea-south-lake-union',
    name: 'South Lake Union (Amazon HQ Campus)',
    subtitle: 'South Lake Union, Seattle, WA',
    state: 'Washington',
    country: 'United States',
    category: 'district',
    region: 'West',
    coordinates: { longitude: -122.3360, latitude: 47.6220, zoom: 16.2, pitch: 60, bearing: 0 },
    baselineAirTempF: 83.2,
    baselineSurfaceTempF: 99.0,
    description: 'Dense tech district with modern LEED-certified glass high-rises and green roof installations.'
  },

  // === LAS VEGAS IN-DEPTH LOCATIONS ===
  {
    id: 'lv-the-strip',
    name: 'Las Vegas Strip (Bellagio & Caesars)',
    subtitle: 'Paradise / The Strip, Las Vegas, NV',
    state: 'Nevada',
    country: 'United States',
    category: 'landmark',
    region: 'Southwest',
    coordinates: { longitude: -115.1728, latitude: 36.1147, zoom: 16.5, pitch: 60, bearing: 20 },
    baselineAirTempF: 108.0,
    baselineSurfaceTempF: 132.5,
    description: 'World-famous mega-resort boulevard with massive flat rooftop acreage and continuous HVAC exhaust.'
  },
  {
    id: 'lv-fremont-street',
    name: 'Fremont Street Experience Downtown',
    subtitle: 'Downtown Las Vegas, NV',
    state: 'Nevada',
    country: 'United States',
    category: 'street',
    region: 'Southwest',
    coordinates: { longitude: -115.1440, latitude: 36.1700, zoom: 16.2, pitch: 60, bearing: -10 },
    baselineAirTempF: 107.0,
    baselineSurfaceTempF: 130.0,
    description: 'Canopied urban entertainment mall where massive LED canopy captures radiant boundary layer heat.'
  },

  // === WASHINGTON D.C. IN-DEPTH LOCATIONS ===
  {
    id: 'dc-national-mall',
    name: 'National Mall & Capitol Hill',
    subtitle: 'Washington, DC',
    state: 'District of Columbia',
    country: 'United States',
    category: 'landmark',
    region: 'Northeast',
    coordinates: { longitude: -77.0090, latitude: 38.8899, zoom: 16.0, pitch: 60, bearing: -10 },
    baselineAirTempF: 89.5,
    baselineSurfaceTempF: 108.5,
    description: 'Monumental federal corridor with extensive paved promenades and severe summer heat humidity.'
  },
  {
    id: 'dc-georgetown',
    name: 'Georgetown Historic Waterfront & M St',
    subtitle: 'Georgetown, Washington, DC',
    state: 'District of Columbia',
    country: 'United States',
    category: 'neighborhood',
    region: 'Northeast',
    coordinates: { longitude: -77.0620, latitude: 38.9050, zoom: 16.0, pitch: 60, bearing: 25 },
    baselineAirTempF: 88.8,
    baselineSurfaceTempF: 107.0,
    description: 'Historic brick and cobblestone enclave along the Potomac with localized urban heat sinks.'
  }
];

// -------------------------------------------------------------
// Comprehensive United States Metropolitan & Regional Cities Database
// -------------------------------------------------------------
export const US_CITIES: CityPreset[] = [
  // --- TOP US METROPOLISES ---
  {
    id: 'new-york-ny',
    name: 'New York City',
    subtitle: 'New York, United States',
    state: 'New York',
    country: 'United States',
    category: 'city',
    region: 'Northeast',
    coordinates: { longitude: -73.9851, latitude: 40.7484, zoom: 14.2, pitch: 60, bearing: -15 },
    baselineAirTempF: 89.2,
    baselineSurfaceTempF: 107.5,
    description: 'High-density asphalt & concrete corridor with acute 2m pedestrian thermal disparities during summer heatwaves.'
  },
  {
    id: 'los-angeles-ca',
    name: 'Los Angeles',
    subtitle: 'California, United States',
    state: 'California',
    country: 'United States',
    category: 'city',
    region: 'West',
    coordinates: { longitude: -118.2437, latitude: 34.0522, zoom: 14.2, pitch: 60, bearing: 25 },
    baselineAirTempF: 92.4,
    baselineSurfaceTempF: 114.8,
    description: 'Sprawling low-albedo urban basin with extensive heat entrapment across transit corridors and parking infrastructure.'
  },
  {
    id: 'chicago-il',
    name: 'Chicago',
    subtitle: 'Illinois, United States',
    state: 'Illinois',
    country: 'United States',
    category: 'city',
    region: 'Midwest',
    coordinates: { longitude: -87.6298, latitude: 41.8781, zoom: 14.5, pitch: 60, bearing: 0 },
    baselineAirTempF: 86.8,
    baselineSurfaceTempF: 104.2,
    description: 'High-rise skyscraper canyon with microclimate thermal channeling and heavy rooftop chiller peak loads.'
  },
  {
    id: 'houston-tx',
    name: 'Houston',
    subtitle: 'Texas, United States',
    state: 'Texas',
    country: 'United States',
    category: 'city',
    region: 'South',
    coordinates: { longitude: -95.3698, latitude: 29.7604, zoom: 14.0, pitch: 60, bearing: -20 },
    baselineAirTempF: 96.5,
    baselineSurfaceTempF: 119.0,
    description: 'Subtropical high-humidity thermal basin with extreme building envelope air conditioning cooling loads.'
  },
  {
    id: 'phoenix-az',
    name: 'Phoenix',
    subtitle: 'Arizona, United States',
    state: 'Arizona',
    country: 'United States',
    category: 'city',
    region: 'Southwest',
    coordinates: { longitude: -112.0740, latitude: 33.4484, zoom: 14.2, pitch: 60, bearing: 15 },
    baselineAirTempF: 108.5,
    baselineSurfaceTempF: 132.0,
    description: 'Extreme Sonoran desert urban heat island where 2m nighttime ambient air remains trapped above 90°F.'
  },
  {
    id: 'philadelphia-pa',
    name: 'Philadelphia',
    subtitle: 'Pennsylvania, United States',
    state: 'Pennsylvania',
    country: 'United States',
    category: 'city',
    region: 'Northeast',
    coordinates: { longitude: -75.1652, latitude: 39.9526, zoom: 14.3, pitch: 60, bearing: 10 },
    baselineAirTempF: 88.0,
    baselineSurfaceTempF: 106.3,
    description: 'Historic masonry and asphalt grid with critical canopy deficits across inner-city residential blocks.'
  },
  {
    id: 'san-antonio-tx',
    name: 'San Antonio',
    subtitle: 'Texas, United States',
    state: 'Texas',
    country: 'United States',
    category: 'city',
    region: 'South',
    coordinates: { longitude: -98.4936, latitude: 29.4241, zoom: 14.2, pitch: 60, bearing: -10 },
    baselineAirTempF: 97.2,
    baselineSurfaceTempF: 120.4,
    description: 'South Texas solar radiation corridor with high commercial roof albedo retrofit opportunities.'
  },
  {
    id: 'san-diego-ca',
    name: 'San Diego',
    subtitle: 'California, United States',
    state: 'California',
    country: 'United States',
    category: 'city',
    region: 'West',
    coordinates: { longitude: -117.1611, latitude: 32.7157, zoom: 14.4, pitch: 60, bearing: -30 },
    baselineAirTempF: 82.5,
    baselineSurfaceTempF: 98.0,
    description: 'Coastal maritime climate with sharp inland thermal boundary gradients and solar roof potential.'
  },
  {
    id: 'dallas-tx',
    name: 'Dallas',
    subtitle: 'Texas, United States',
    state: 'Texas',
    country: 'United States',
    category: 'city',
    region: 'South',
    coordinates: { longitude: -96.7970, latitude: 32.7767, zoom: 14.3, pitch: 60, bearing: 20 },
    baselineAirTempF: 98.6,
    baselineSurfaceTempF: 122.1,
    description: 'High-density commercial core subject to rapid summer heat accumulation and high chiller peak spikes.'
  },
  {
    id: 'austin-tx',
    name: 'Austin',
    subtitle: 'Texas, United States',
    state: 'Texas',
    country: 'United States',
    category: 'city',
    region: 'South',
    coordinates: { longitude: -97.7431, latitude: 30.2672, zoom: 14.5, pitch: 60, bearing: 0 },
    baselineAirTempF: 97.8,
    baselineSurfaceTempF: 121.0,
    description: 'Fast-growing tech corridor with urgent cool roof and urban tree canopy expansion mandates.'
  },
  {
    id: 'san-jose-ca',
    name: 'San Jose',
    subtitle: 'California, United States',
    state: 'California',
    country: 'United States',
    category: 'city',
    region: 'West',
    coordinates: { longitude: -121.8863, latitude: 37.3382, zoom: 14.0, pitch: 60, bearing: 15 },
    baselineAirTempF: 87.5,
    baselineSurfaceTempF: 106.0,
    description: 'Silicon Valley commercial campus clusters with massive industrial roof footprints ready for solar-reflective coatings.'
  },
  {
    id: 'san-francisco-ca',
    name: 'San Francisco',
    subtitle: 'California, United States',
    state: 'California',
    country: 'United States',
    category: 'city',
    region: 'West',
    coordinates: { longitude: -122.4194, latitude: 37.7749, zoom: 14.2, pitch: 60, bearing: -20 },
    baselineAirTempF: 74.0,
    baselineSurfaceTempF: 89.5,
    description: 'Complex coastal microclimate where dense high-rises create dynamic localized heat pockets.'
  },
  {
    id: 'seattle-wa',
    name: 'Seattle',
    subtitle: 'Washington, United States',
    state: 'Washington',
    country: 'United States',
    category: 'city',
    region: 'West',
    coordinates: { longitude: -122.3321, latitude: 47.6062, zoom: 14.2, pitch: 60, bearing: -15 },
    baselineAirTempF: 81.2,
    baselineSurfaceTempF: 96.0,
    description: 'Pacific Northwest urban center vulnerable to intensifying anomalous summer heat dome events.'
  },
  {
    id: 'denver-co',
    name: 'Denver',
    subtitle: 'Colorado, United States',
    state: 'Colorado',
    country: 'United States',
    category: 'city',
    region: 'West',
    coordinates: { longitude: -104.9903, latitude: 39.7392, zoom: 14.2, pitch: 60, bearing: 30 },
    baselineAirTempF: 91.0,
    baselineSurfaceTempF: 113.5,
    description: 'Mile-high high-altitude solar irradiance microclimate with rapid concrete surface heat absorption.'
  },
  {
    id: 'boston-ma',
    name: 'Boston',
    subtitle: 'Massachusetts, United States',
    state: 'Massachusetts',
    country: 'United States',
    category: 'city',
    region: 'Northeast',
    coordinates: { longitude: -71.0589, latitude: 42.3601, zoom: 14.3, pitch: 60, bearing: -10 },
    baselineAirTempF: 85.5,
    baselineSurfaceTempF: 102.8,
    description: 'Dense historic street grid with high building thermal mass and acute pedestrian heat vulnerability.'
  },
  {
    id: 'miami-fl',
    name: 'Miami',
    subtitle: 'Florida, United States',
    state: 'Florida',
    country: 'United States',
    category: 'city',
    region: 'South',
    coordinates: { longitude: -80.1918, latitude: 25.7617, zoom: 14.4, pitch: 60, bearing: 20 },
    baselineAirTempF: 93.0,
    baselineSurfaceTempF: 112.5,
    description: 'Tropical high-humidity corridor with continuous year-round HVAC chiller strain and high solar radiation.'
  },
  {
    id: 'atlanta-ga',
    name: 'Atlanta',
    subtitle: 'Georgia, United States',
    state: 'Georgia',
    country: 'United States',
    category: 'city',
    region: 'South',
    coordinates: { longitude: -84.3880, latitude: 33.7490, zoom: 14.2, pitch: 60, bearing: -5 },
    baselineAirTempF: 91.8,
    baselineSurfaceTempF: 111.0,
    description: 'Extensive tree canopy coverage contrasted with severe heat traps along transit and asphalt corridors.'
  },
  {
    id: 'las-vegas-nv',
    name: 'Las Vegas',
    subtitle: 'Nevada, United States',
    state: 'Nevada',
    country: 'United States',
    category: 'city',
    region: 'Southwest',
    coordinates: { longitude: -115.1728, latitude: 36.1147, zoom: 14.1, pitch: 60, bearing: 15 },
    baselineAirTempF: 106.8,
    baselineSurfaceTempF: 129.5,
    description: 'Hyper-arid Mojave basin with massive hospitality roof footprints and extreme day/night thermal retention.'
  },
  {
    id: 'portland-or',
    name: 'Portland',
    subtitle: 'Oregon, United States',
    state: 'Oregon',
    country: 'United States',
    category: 'city',
    region: 'West',
    coordinates: { longitude: -122.6784, latitude: 45.5152, zoom: 14.3, pitch: 60, bearing: 0 },
    baselineAirTempF: 84.5,
    baselineSurfaceTempF: 99.8,
    description: 'Pioneering green infrastructure hub focusing on bioswales and cool roof albedo optimization.'
  },
  {
    id: 'washington-dc',
    name: 'Washington',
    subtitle: 'District of Columbia, United States',
    state: 'District of Columbia',
    country: 'United States',
    category: 'city',
    region: 'Northeast',
    coordinates: { longitude: -77.0369, latitude: 38.9072, zoom: 14.2, pitch: 60, bearing: -10 },
    baselineAirTempF: 89.0,
    baselineSurfaceTempF: 108.0,
    description: 'Federal district corridor with broad paved avenues and significant pedestrian microclimate disparities.'
  },
  {
    id: 'nashville-tn',
    name: 'Nashville',
    subtitle: 'Tennessee, United States',
    state: 'Tennessee',
    country: 'United States',
    category: 'city',
    region: 'South',
    coordinates: { longitude: -86.7816, latitude: 36.1627, zoom: 14.3, pitch: 60, bearing: 15 },
    baselineAirTempF: 92.0,
    baselineSurfaceTempF: 110.5,
    description: 'Rapid commercial redevelopment corridor with high potential for cool roof coatings on new developments.'
  },
  {
    id: 'detroit-mi',
    name: 'Detroit',
    subtitle: 'Michigan, United States',
    state: 'Michigan',
    country: 'United States',
    category: 'city',
    region: 'Midwest',
    coordinates: { longitude: -83.0458, latitude: 42.3314, zoom: 14.2, pitch: 60, bearing: 20 },
    baselineAirTempF: 85.0,
    baselineSurfaceTempF: 102.5,
    description: 'Broad industrial and logistics corridors with extensive impervious pavement heat accumulation.'
  },
  {
    id: 'minneapolis-mn',
    name: 'Minneapolis',
    subtitle: 'Minnesota, United States',
    state: 'Minnesota',
    country: 'United States',
    category: 'city',
    region: 'Midwest',
    coordinates: { longitude: -93.2650, latitude: 44.9778, zoom: 14.3, pitch: 60, bearing: -15 },
    baselineAirTempF: 83.8,
    baselineSurfaceTempF: 100.5,
    description: 'Northern urban corridor experiencing increased summer heatwave spikes and urban heat retention.'
  },
  {
    id: 'tampa-fl',
    name: 'Tampa',
    subtitle: 'Florida, United States',
    state: 'Florida',
    country: 'United States',
    category: 'city',
    region: 'South',
    coordinates: { longitude: -82.4572, latitude: 27.9506, zoom: 14.2, pitch: 60, bearing: -10 },
    baselineAirTempF: 93.5,
    baselineSurfaceTempF: 113.2,
    description: 'Gulf Coast high-humidity zone with intense solar thermal loading on commercial retail and logistics roofs.'
  },
  {
    id: 'orlando-fl',
    name: 'Orlando',
    subtitle: 'Florida, United States',
    state: 'Florida',
    country: 'United States',
    category: 'city',
    region: 'South',
    coordinates: { longitude: -81.3792, latitude: 28.5383, zoom: 14.1, pitch: 60, bearing: 10 },
    baselineAirTempF: 94.2,
    baselineSurfaceTempF: 115.0,
    description: 'High solar irradiance subtropical basin with extensive tourist infrastructure heat islands.'
  },
  {
    id: 'salt-lake-city-ut',
    name: 'Salt Lake City',
    subtitle: 'Utah, United States',
    state: 'Utah',
    country: 'United States',
    category: 'city',
    region: 'West',
    coordinates: { longitude: -111.8910, latitude: 40.7608, zoom: 14.2, pitch: 60, bearing: -15 },
    baselineAirTempF: 94.0,
    baselineSurfaceTempF: 117.0,
    description: 'Intermountain valley thermal basin where boundary layer heat traps accumulate between mountain ranges.'
  },
  {
    id: 'new-orleans-la',
    name: 'New Orleans',
    subtitle: 'Louisiana, United States',
    state: 'Louisiana',
    country: 'United States',
    category: 'city',
    region: 'South',
    coordinates: { longitude: -90.0715, latitude: 29.9511, zoom: 14.5, pitch: 60, bearing: 25 },
    baselineAirTempF: 94.5,
    baselineSurfaceTempF: 113.8,
    description: 'Deltaic high-humidity urban fabric with dense historic architecture and localized air stagnation.'
  },

  // --- INTERNATIONAL SHOWCASE HUBS ---
  {
    id: 'abu-dhabi',
    name: 'Abu Dhabi (Masdar City / Corniche)',
    subtitle: 'Abu Dhabi, United Arab Emirates',
    country: 'United Arab Emirates',
    category: 'city',
    region: 'International',
    coordinates: { longitude: 54.6186, latitude: 24.4267, zoom: 14.5, pitch: 60, bearing: -20 },
    baselineAirTempF: 104.2,
    baselineSurfaceTempF: 122.5,
    description: 'High solar irradiance desert microclimate with heavy urban albedo trapping and active construction projects.'
  },
  {
    id: 'dubai',
    name: 'Dubai (Downtown / Business Bay)',
    subtitle: 'Dubai, United Arab Emirates',
    country: 'United Arab Emirates',
    category: 'city',
    region: 'International',
    coordinates: { longitude: 55.2708, latitude: 25.1972, zoom: 14.2, pitch: 60, bearing: 35 },
    baselineAirTempF: 102.8,
    baselineSurfaceTempF: 119.4,
    description: 'Dense high-rise corridor with extreme urban canyon heat trapping and high chiller electricity load.'
  },
  {
    id: 'riyadh',
    name: 'Riyadh (KAFD / Olaya)',
    subtitle: 'Riyadh, Saudi Arabia',
    country: 'Saudi Arabia',
    category: 'city',
    region: 'International',
    coordinates: { longitude: 46.6575, latitude: 24.7645, zoom: 14.2, pitch: 60, bearing: 10 },
    baselineAirTempF: 109.1,
    baselineSurfaceTempF: 129.3,
    description: 'Hyper-arid metropolitan basin with critical concrete curing evaporation rates and massive cool roof ROI.'
  }
];

// All presets combining in-city locations and cities
export const ALL_PRESETS: CityPreset[] = [...IN_CITY_LOCATIONS, ...US_CITIES];
export const CITY_PRESETS = ALL_PRESETS;

// Helper to filter presets by text query
export function searchLocations(query: string): CityPreset[] {
  if (!query || query.trim() === '') return ALL_PRESETS.slice(0, 20);
  const q = query.toLowerCase().trim();
  return ALL_PRESETS.filter(c => 
    c.name.toLowerCase().includes(q) ||
    (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
    (c.state && c.state.toLowerCase().includes(q)) ||
    c.country.toLowerCase().includes(q) ||
    (c.region && c.region.toLowerCase().includes(q)) ||
    (c.category && c.category.toLowerCase().includes(q))
  );
}

export const searchCities = searchLocations;

// Helper to create a dynamic location preset from live geocoding
export function createDynamicLocationPreset(
  name: string,
  subtitle: string,
  category: 'landmark' | 'neighborhood' | 'street' | 'city' | 'district' | 'address',
  lat: number,
  lng: number,
  baseTempF: number = 90.0,
  zoomLevel?: number
): CityPreset {
  const id = `loc-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.round(lat * 1000)}`;
  const defaultZoom = category === 'landmark' || category === 'address' || category === 'street'
    ? 16.5
    : category === 'neighborhood' || category === 'district'
    ? 15.4
    : 14.2;

  return {
    id,
    name,
    subtitle: subtitle || 'Geocoded Location',
    state: subtitle.split(',')[1]?.trim() || 'USA',
    country: 'United States',
    category: category as any,
    region: 'West',
    coordinates: {
      longitude: lng,
      latitude: lat,
      zoom: zoomLevel || defaultZoom,
      pitch: 60,
      bearing: -20
    },
    baselineAirTempF: baseTempF,
    baselineSurfaceTempF: baseTempF + 18.5,
    description: `Dynamic microclimate digital twin for ${name} (${subtitle}).`
  };
}

export const createDynamicCityPreset = (
  name: string,
  state: string = 'USA',
  lat: number,
  lng: number,
  baseTempF: number = 90.0
) => createDynamicLocationPreset(name, `${name}, ${state}`, 'city', lat, lng, baseTempF);

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
