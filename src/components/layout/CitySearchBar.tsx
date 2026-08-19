"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, MapPin, ThermometerSun, X, Globe, Sparkles, Loader2, ChevronDown } from 'lucide-react';
import { CityPreset, US_CITIES, searchCities, createDynamicCityPreset } from '../../lib/map-presets';

interface CitySearchBarProps {
  selectedCity: CityPreset;
  onSelectCity: (city: CityPreset) => void;
}

const REGION_FILTERS = ['All US', 'Top Metros', 'High Heat (Sunbelt)', 'West', 'South', 'Midwest', 'Northeast'] as const;

export default function CitySearchBar({ selectedCity, onSelectCity }: CitySearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All US');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered cities based on text and region tab
  const filteredCities = useMemo(() => {
    let list = searchCities(searchQuery);

    if (selectedRegion === 'Top Metros') {
      const topIds = ['new-york-ny', 'los-angeles-ca', 'chicago-il', 'houston-tx', 'phoenix-az', 'philadelphia-pa', 'san-antonio-tx', 'san-diego-ca', 'dallas-tx', 'austin-tx', 'san-francisco-ca', 'seattle-wa', 'denver-co', 'boston-ma', 'miami-fl', 'atlanta-ga', 'las-vegas-nv'];
      list = list.filter(c => topIds.includes(c.id));
    } else if (selectedRegion === 'High Heat (Sunbelt)') {
      list = list.filter(c => c.baselineAirTempF >= 94.0);
    } else if (selectedRegion !== 'All US') {
      list = list.filter(c => c.region === selectedRegion);
    }

    return list;
  }, [searchQuery, selectedRegion]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.min(filteredCities.length - 1, prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.max(0, prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCities[highlightedIndex]) {
        handleSelect(filteredCities[highlightedIndex]);
      } else if (searchQuery.trim().length > 2) {
        handleLiveGeocodeSearch(searchQuery);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (city: CityPreset) => {
    onSelectCity(city);
    setIsOpen(false);
    setSearchQuery('');
    setGeocodeError(null);
  };

  // Live OpenStreetMap US Geocoder fallback for ANY US city / town
  const handleLiveGeocodeSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsGeocoding(true);
    setGeocodeError(null);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=us&format=json&addressdetails=1&limit=1`,
        { headers: { 'Accept-Language': 'en-US,en;q=0.9' } }
      );

      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const item = data[0];
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          const cityName = item.address?.city || item.address?.town || item.address?.village || item.name || query;
          const stateName = item.address?.state || 'US';

          // Estimate baseline temperature from latitude
          const estTempF = lat < 33 ? 98.0 : lat < 38 ? 92.0 : 85.0;

          const customCity = createDynamicCityPreset(cityName, stateName, lat, lng, estTempF);
          handleSelect(customCity);
          return;
        }
      }
      setGeocodeError(`Could not find "${query}" in US records. Please try another city.`);
    } catch {
      setGeocodeError('Geocoding service unavailable. Please select from the pre-indexed US cities.');
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <div ref={containerRef} className="relative z-40">
      {/* Search Input Trigger */}
      <div
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 rounded-2xl px-3.5 py-1.5 shadow-lg cursor-pointer transition-all min-w-[210px] sm:min-w-[280px] max-w-sm"
      >
        <MapPin size={15} className="text-cyan-400 shrink-0" />
        <div className="flex-1 flex items-center justify-between overflow-hidden">
          <span className="text-xs font-bold text-white truncate pr-2">
            {selectedCity.name}
          </span>
          {selectedCity.state && (
            <span className="bg-blue-500/20 text-cyan-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-blue-400/30 shrink-0">
              {selectedCity.state}
            </span>
          )}
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
      </div>

      {/* Floating Autocomplete Dropdown Modal */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-[340px] sm:w-[460px] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 shadow-2xl rounded-3xl p-3.5 flex flex-col gap-3 text-white ring-1 ring-white/10 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Search Header Input */}
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-3 text-cyan-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setHighlightedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search any US city (e.g. Phoenix, Austin, Miami, Seattle)..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl pl-9 pr-9 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-medium"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-white p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            {REGION_FILTERS.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-2.5 py-1 rounded-xl whitespace-nowrap font-semibold transition-all ${
                  selectedRegion === r
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* City Result List */}
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1 font-sans">
            {filteredCities.length === 0 ? (
              <div className="py-5 px-3 text-center flex flex-col items-center gap-2 text-slate-400">
                <Globe size={24} className="text-slate-600" />
                <p className="text-xs">No indexed preset found matching &ldquo;{searchQuery}&rdquo;</p>
                <button
                  onClick={() => handleLiveGeocodeSearch(searchQuery)}
                  disabled={isGeocoding}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg transition-all"
                >
                  {isGeocoding ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Geocoding US Map Coordinates...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} className="text-amber-300" />
                      <span>Search Live US Geocoder for &ldquo;{searchQuery}&rdquo;</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              filteredCities.map((city, idx) => {
                const isSelected = selectedCity.id === city.id;
                const isHighlighted = highlightedIndex === idx;

                return (
                  <div
                    key={city.id}
                    onClick={() => handleSelect(city)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : isHighlighted
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        city.baselineAirTempF >= 98
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : city.baselineAirTempF >= 90
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        <MapPin size={12} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">
                          {city.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {city.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-lg ${
                        city.baselineAirTempF >= 98
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : city.baselineAirTempF >= 90
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {city.baselineAirTempF}°F
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {geocodeError && (
            <div className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-2 text-center">
              {geocodeError}
            </div>
          )}

          {/* Quick Popular US Cities Chips */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="text-slate-400 font-semibold mr-1">Popular:</span>
            {['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Miami', 'Seattle', 'Austin'].map(name => {
              const match = US_CITIES.find(c => c.name.toLowerCase().includes(name.toLowerCase()));
              if (!match) return null;
              return (
                <button
                  key={name}
                  onClick={() => handleSelect(match)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded-lg transition-colors border border-slate-700/60"
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
