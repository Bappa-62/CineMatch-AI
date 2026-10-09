import React from 'react';
import { SlidersHorizontal, RotateCcw, Clock, Star, Calendar, Zap, Sparkles, Globe } from 'lucide-react';

export interface FilterState {
  genres: string[];
  decade: string;
  minRating: number;
  maxRuntime: number;
  pacing: string;
  tone: string;
  industry: string; // 'all' | 'hollywood' | 'bollywood' | 'international'
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const INDUSTRY_OPTIONS = [
  { label: 'All Cinema', value: 'all', desc: 'Worldwide' },
  { label: 'Hollywood', value: 'hollywood', desc: 'US / Western' },
  { label: 'Bollywood', value: 'bollywood', desc: 'Hindi / India' },
  { label: 'World Cinema', value: 'international', desc: 'International' },
];

const GENRE_OPTIONS = [
  'Sci-Fi',
  'Thriller',
  'Mystery',
  'Drama',
  'Crime',
  'Action',
  'Psychological',
  'Adventure',
  'Horror',
  'Romance',
  'Comedy',
  'Animation',
];

const DECADE_OPTIONS = [
  { label: 'Any Era', value: '' },
  { label: '2020s (Modern)', value: '2020s' },
  { label: '2010s (Golden Age)', value: '2010s' },
  { label: '2000s (New Millenium)', value: '2000s' },
  { label: '1990s (Indie Surge)', value: '1990s' },
  { label: 'Classic (Pre-1990)', value: 'classic' },
];

const RUNTIME_OPTIONS = [
  { label: 'Any Length', value: 0 },
  { label: 'Brisk (< 100m)', value: 100 },
  { label: 'Standard (< 130m)', value: 130 },
  { label: 'Epic (< 170m)', value: 170 },
];

const MIN_RATING_OPTIONS = [
  { label: 'Any Rating', value: 0 },
  { label: '7.5+ IMDb', value: 7.5 },
  { label: '8.0+ IMDb', value: 8.0 },
  { label: '8.5+ Masterpiece', value: 8.5 },
];

const PACING_OPTIONS = [
  { label: 'Any Pacing', value: '' },
  { label: 'Fast & Propulsive', value: 'fast' },
  { label: 'Slow Burn & Atmospheric', value: 'slow_burn' },
  { label: 'Deliberate & Measured', value: 'deliberate' },
];

const TONE_OPTIONS = [
  { label: 'Any Tone', value: '' },
  { label: 'Cerebral & Complex', value: 'cerebral' },
  { label: 'Dark & Unsettling', value: 'dark' },
  { label: 'Warm & Uplifting', value: 'uplifting' },
  { label: 'Tense & Claustrophobic', value: 'tense' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onReset,
  isOpen,
  onToggle,
}) => {
  const activeCount =
    filters.genres.length +
    (filters.industry && filters.industry !== 'all' ? 1 : 0) +
    (filters.decade ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.maxRuntime > 0 ? 1 : 0) +
    (filters.pacing ? 1 : 0) +
    (filters.tone ? 1 : 0);

  const toggleGenre = (genre: string) => {
    const exists = filters.genres.includes(genre);
    const updated = exists
      ? filters.genres.filter((g) => g !== genre)
      : [...filters.genres, genre];
    onChange({ ...filters, genres: updated });
  };

  return (
    <div className="border border-neutral-800/80 rounded-xl bg-neutral-900/60 backdrop-blur-sm overflow-hidden mb-6">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800/60">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2 text-sm font-medium text-neutral-300 hover:text-amber-400 transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4 text-amber-500" />
          <span>Cinematic Precision Filters</span>
          {activeCount > 0 && (
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {activeCount} active
            </span>
          )}
        </button>

        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
          <button
            type="button"
            onClick={onToggle}
            className="text-xs text-neutral-400 hover:text-neutral-200 font-mono"
          >
            {isOpen ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {/* Filter Body */}
      {isOpen && (
        <div className="p-4 sm:p-5 space-y-5 text-xs">
          {/* Cinema Industry Origin (Hollywood vs Bollywood) */}
          <div>
            <label className="flex items-center gap-1.5 text-neutral-300 font-medium mb-2 uppercase tracking-wider text-[11px]">
              <Globe className="h-3.5 w-3.5 text-amber-400" />
              <span>Film Industry & Origin (Hollywood / Bollywood)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {INDUSTRY_OPTIONS.map((opt) => {
                const isSelected = (filters.industry || 'all') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange({ ...filters, industry: opt.value })}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-neutral-950 font-semibold shadow-md shadow-amber-500/20'
                        : 'bg-neutral-800/80 text-neutral-300 border border-neutral-700/60 hover:bg-neutral-700 hover:text-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span
                      className={`text-[10px] font-mono ${
                        isSelected ? 'text-neutral-900/80' : 'text-neutral-500'
                      }`}
                    >
                      ({opt.desc})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Genre Selection */}
          <div className="pt-2 border-t border-neutral-800/60">
            <label className="block text-neutral-300 font-medium mb-2 uppercase tracking-wider text-[11px]">
              Genres of Interest
            </label>
            <div className="flex flex-wrap gap-1.5">
              {GENRE_OPTIONS.map((genre) => {
                const isSelected = filters.genres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                        : 'bg-neutral-800/60 text-neutral-400 border border-neutral-700/50 hover:bg-neutral-800 hover:text-neutral-200'
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid of Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-neutral-800/60">
            {/* Decade / Era */}
            <div>
              <label className="flex items-center gap-1.5 text-neutral-300 font-medium mb-2 text-[11px] uppercase tracking-wider">
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                <span>Era / Decade</span>
              </label>
              <select
                value={filters.decade}
                onChange={(e) => onChange({ ...filters, decade: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-amber-500 transition-colors"
              >
                {DECADE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Runtime */}
            <div>
              <label className="flex items-center gap-1.5 text-neutral-300 font-medium mb-2 text-[11px] uppercase tracking-wider">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span>Runtime Cap</span>
              </label>
              <select
                value={filters.maxRuntime}
                onChange={(e) =>
                  onChange({ ...filters, maxRuntime: Number(e.target.value) })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-amber-500 transition-colors"
              >
                {RUNTIME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="flex items-center gap-1.5 text-neutral-300 font-medium mb-2 text-[11px] uppercase tracking-wider">
                <Star className="h-3.5 w-3.5 text-amber-400" />
                <span>Minimum Rating</span>
              </label>
              <select
                value={filters.minRating}
                onChange={(e) =>
                  onChange({ ...filters, minRating: Number(e.target.value) })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-amber-500 transition-colors"
              >
                {MIN_RATING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Pacing & Tone */}
            <div>
              <label className="flex items-center gap-1.5 text-neutral-300 font-medium mb-2 text-[11px] uppercase tracking-wider">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>Pacing Vibe</span>
              </label>
              <select
                value={filters.pacing}
                onChange={(e) => onChange({ ...filters, pacing: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-amber-500 transition-colors"
              >
                {PACING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
