"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  MapPin,
  X,
  Globe,
  Sparkles,
  Loader2,
  ChevronDown,
  Building2,
  Navigation,
  Compass
} from 'lucide-react';
import {
  CityPreset,
  ALL_PRESETS,
  searchLocations,
  createDynamicLocationPreset
} from '../../lib/map-presets';

interface CitySearchBarProps {
  selectedCity: CityPreset;
  onSelectCity: (city: CityPreset) => void;
}

const CATEGORY_TABS = [
  'All Places',
  'Landmarks',
  'Neighborhoods',
  'Cities & Metros',
  'High Heat'
] as const;

export default function CitySearchBar({ selectedCity, onSelectCity }: CitySearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>('All Places');
  const [isLiveSearching, setIsLiveSearching] = useState(false);
  const [liveGeocodeResults, setLiveGeocodeResults] = useState<CityPreset[]>([]);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

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

  // Filter local presets based on text query and category tab
  const localFilteredPresets = useMemo(() => {
    let list = searchLocations(searchQuery);

    if (selectedTab === 'Landmarks') {
      list = list.filter(c => c.category === 'landmark');
    } else if (selectedTab === 'Neighborhoods') {
      list = list.filter(c => c.category === 'neighborhood' || c.category === 'district' || c.category === 'street');
    } else if (selectedTab === 'Cities & Metros') {
      list = list.filter(c => c.category === 'city' || !c.category);
    } else if (selectedTab === 'High Heat') {
      list = list.filter(c => c.baselineAirTempF >= 94.0);
    }

    return list;
  }, [searchQuery, selectedTab]);

  // Combined Results: Local Presets + Live Geocoded Places
  const allDisplayResults = useMemo(() => {
    if (!searchQuery.trim()) return localFilteredPresets;

    const combined = [...localFilteredPresets];
    liveGeocodeResults.forEach(liveItem => {
      const exists = combined.some(c => 
        Math.abs(c.coordinates.latitude - liveItem.coordinates.latitude) < 0.005 &&
        Math.abs(c.coordinates.longitude - liveItem.coordinates.longitude) < 0.005
      );
      if (!exists) {
        combined.push(liveItem);
      }
    });

    return combined;
  }, [localFilteredPresets, liveGeocodeResults, searchQuery]);

  // Live in-city geocoding via Photon / OpenStreetMap API
  const performLiveGeocode = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setLiveGeocodeResults([]);
      setIsLiveSearching(false);
      return;
    }

    setIsLiveSearching(true);
    setGeocodeError(null);

    try {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6`
      );

      if (res.ok) {
        const data = await res.json();
        if (data && data.features && data.features.length > 0) {
          const results: CityPreset[] = data.features.map((feat: any) => {
            const props = feat.properties || {};
            const [lng, lat] = feat.geometry.coordinates;

            const name = props.name || props.street || query;
            const city = props.city || props.town || props.county || '';
            const state = props.state || '';
            const country = props.country || 'USA';
            
            const subtitleParts = [props.district, props.street, city, state, country].filter(Boolean);
            const subtitle = subtitleParts.length > 0 ? subtitleParts.join(', ') : `${name}, ${state || country}`;

            let category: 'landmark' | 'neighborhood' | 'street' | 'city' | 'address' = 'landmark';
            if (props.type === 'city' || props.type === 'town' || props.type === 'administrative') category = 'city';
            else if (props.type === 'district' || props.type === 'suburb' || props.type === 'neighbourhood') category = 'neighborhood';
            else if (props.type === 'street' || props.type === 'highway') category = 'street';
            else if (props.type === 'house' || props.type === 'address') category = 'address';

            const estTempF = lat < 30 ? 98.0 : lat < 36 ? 94.0 : lat < 41 ? 89.0 : 83.0;

            return createDynamicLocationPreset(
              name,
              subtitle,
              category,
              lat,
              lng,
              estTempF
            );
          });

          setLiveGeocodeResults(results);
        }
      }
    } catch {
      // Fallback silently if offline
    } finally {
      setIsLiveSearching(false);
    }
  }, []);

  // Debounced input typing
  const handleInputChange = (val: string) => {
    setSearchQuery(val);
    setHighlightedIndex(0);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (val.trim().length >= 2) {
      debounceTimer.current = setTimeout(() => {
        performLiveGeocode(val);
      }, 250);
    } else {
      setLiveGeocodeResults([]);
      setIsLiveSearching(false);
    }
  };

  const handleSelect = (location: CityPreset) => {
    onSelectCity(location);
    setIsOpen(false);
    setSearchQuery('');
    setGeocodeError(null);
    setLiveGeocodeResults([]);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.min(allDisplayResults.length - 1, prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.max(0, prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allDisplayResults[highlightedIndex]) {
        handleSelect(allDisplayResults[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const renderCategoryIcon = (category?: string) => {
    switch (category) {
      case 'landmark':
        return <Building2 size={13} className="text-amber-600" />;
      case 'neighborhood':
      case 'district':
        return <Compass size={13} className="text-blue-600" />;
      case 'street':
      case 'address':
        return <Navigation size={13} className="text-emerald-600" />;
      default:
        return <Globe size={13} className="text-indigo-600" />;
    }
  };

  return (
    <div ref={containerRef} className="relative z-40">
      {/* Google EIE Search Pill Trigger */}
      <div
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className="flex items-center gap-2.5 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/90 rounded-full px-3.5 py-1.5 shadow-sm cursor-pointer transition-all min-w-[220px] sm:min-w-[340px] max-w-lg"
      >
        <MapPin size={15} className="text-blue-600 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-800 truncate font-sans">
              {selectedCity.name}
            </span>
            {selectedCity.category && (
              <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0 hidden sm:inline">
                {selectedCity.category}
              </span>
            )}
          </div>
          {selectedCity.subtitle && (
            <p className="text-[10px] text-slate-500 truncate">
              {selectedCity.subtitle}
            </p>
          )}
        </div>
        <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
      </div>

      {/* Floating Autocomplete Dropdown Modal (Google EIE Light Theme) */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-[340px] sm:w-[500px] bg-white/98 backdrop-blur-2xl border border-slate-200/90 shadow-2xl rounded-3xl p-3.5 flex flex-col gap-3 text-slate-800 ring-1 ring-slate-900/5 animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
          {/* Search Header Input */}
          <div className="relative flex items-center">
            {isLiveSearching ? (
              <Loader2 size={15} className="absolute left-3 text-blue-600 animate-spin" />
            ) : (
              <Search size={15} className="absolute left-3 text-blue-600" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search in-city: Empire State Building, Times Square, Brickell..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-9 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setLiveGeocodeResults([]);
                }}
                className="absolute right-3 text-slate-400 hover:text-slate-700 p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-3 py-1 rounded-full whitespace-nowrap font-bold transition-all ${
                  selectedTab === tab
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
            {allDisplayResults.length === 0 ? (
              <div className="py-6 px-3 text-center flex flex-col items-center gap-2 text-slate-500">
                <Globe size={24} className="text-slate-400" />
                <p className="text-xs font-medium">No matching locations found for &ldquo;{searchQuery}&rdquo;</p>
              </div>
            ) : (
              allDisplayResults.map((loc, idx) => {
                const isSelected = selectedCity.id === loc.id;
                const isHighlighted = highlightedIndex === idx;

                return (
                  <div
                    key={`${loc.id}-${idx}`}
                    onClick={() => handleSelect(loc)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50 text-blue-900 border border-blue-200'
                        : isHighlighted
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        {renderCategoryIcon(loc.category)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold truncate">
                            {loc.name}
                          </span>
                          {loc.category && (
                            <span className="text-[9px] uppercase font-semibold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                              {loc.category}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {loc.subtitle || loc.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        loc.baselineAirTempF >= 98
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : loc.baselineAirTempF >= 90
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                      }`}>
                        {loc.baselineAirTempF}°F
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Popular In-City Hotspots */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="text-slate-500 font-semibold mr-1 flex items-center gap-1">
              <Sparkles size={11} className="text-amber-500" />
              Hotspots:
            </span>
            {[
              { label: 'Empire State (NYC)', id: 'nyc-empire-state' },
              { label: 'Times Square (NYC)', id: 'nyc-times-square' },
              { label: 'Wall Street (NYC)', id: 'nyc-wall-street' },
              { label: 'Santa Monica (LA)', id: 'la-santa-monica-pier' },
              { label: 'Brickell (Miami)', id: 'miami-brickell' },
              { label: 'The Loop (Chicago)', id: 'chicago-the-loop' }
            ].map(item => {
              const match = ALL_PRESETS.find(c => c.id === item.id);
              if (!match) return null;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(match)}
                  className="bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2 py-0.5 rounded-full transition-colors border border-slate-200"
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
