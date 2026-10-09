import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Search,
  X,
  Compass,
  Film,
  Plus,
  Loader2,
  SlidersHorizontal,
  Globe,
} from 'lucide-react';
import { MovieSearchResult } from '../types/movie';
import { FilterBar, FilterState } from './FilterBar';

interface SearchHeroProps {
  onSearch: (params: {
    prompt: string;
    favoriteMovies: string[];
    filters: FilterState;
  }) => void;
  isLoading: boolean;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const MOOD_PRESETS = [
  {
    title: 'Mind-Bending & Labyrinthine',
    prompt: 'Cerebral, reality-questioning storylines with unexpected twists, layered mysteries, and high philosophical stakes like Inception or Shutter Island.',
  },
  {
    title: 'Late-Night Atmospheric Noir',
    prompt: 'Moody rain-soaked streets, neon silhouettes, moral ambiguity, and intoxicating visual style like Blade Runner 2049 or Drive.',
  },
  {
    title: 'Warm & Bittersweet Longing',
    prompt: 'Poetic, emotionally resonant cinema exploring tender human connection, melancholy, and nostalgia like Past Lives, Her, or In the Mood for Love.',
  },
  {
    title: 'Relentless High-Octane Tension',
    prompt: 'Tightly wound psychological suspense or propulsive action where every second matters, like Whiplash, Sicario, or Uncut Gems.',
  },
  {
    title: 'Cerebral Cosmic Wonder',
    prompt: 'Awe-inspiring science fiction dealing with deep space, the nature of time, first contact, or human destiny like Interstellar or Arrival.',
  },
  {
    title: 'Eerie Atmospheric Dread',
    prompt: 'Slow-burn psychological terror with suffocating tension, folk mythology, or unsettling chamber drama like The Witch or Ex Machina.',
  },
];

export const SearchHero: React.FC<SearchHeroProps> = ({
  onSearch,
  isLoading,
  filters,
  setFilters,
}) => {
  const [prompt, setPrompt] = useState('');
  const [favoriteMovies, setFavoriteMovies] = useState<string[]>([
    'Arrival (2016)',
  ]);
  const [movieQuery, setMovieQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MovieSearchResult[]>([]);
  const [isSearchingMovies, setIsSearchingMovies] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced movie autocomplete search
  useEffect(() => {
    if (!movieQuery.trim() || movieQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearchingMovies(false);
      return;
    }

    setIsSearchingMovies(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/movie/search?q=${encodeURIComponent(movieQuery.trim())}`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error('Failed to search movies:', err);
      } finally {
        setIsSearchingMovies(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [movieQuery]);

  // Handle outside click for search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addFavoriteMovie = (movie: MovieSearchResult) => {
    const formatted = `${movie.title} (${movie.year})`;
    if (!favoriteMovies.includes(formatted)) {
      setFavoriteMovies([...favoriteMovies, formatted]);
    }
    setMovieQuery('');
    setShowDropdown(false);
  };

  const removeFavoriteMovie = (movieStr: string) => {
    setFavoriteMovies(favoriteMovies.filter((m) => m !== movieStr));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch({
      prompt: prompt.trim(),
      favoriteMovies,
      filters,
    });
  };

  const applyPreset = (presetPrompt: string) => {
    setPrompt(presetPrompt);
    onSearch({
      prompt: presetPrompt,
      favoriteMovies,
      filters,
    });
  };

  const resetFilters = () => {
    setFilters({
      genres: [],
      decade: '',
      minRating: 0,
      maxRuntime: 0,
      pacing: '',
      tone: '',
      industry: 'all',
    });
  };

  return (
    <div className="relative border-b border-neutral-800/80 bg-gradient-to-b from-neutral-900/80 via-neutral-950 to-neutral-950 px-4 pt-10 pb-12 sm:px-6 lg:px-8">
      {/* Subtle atmospheric ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-[450px] w-[750px] -translate-x-1/2 rounded-full bg-amber-600/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Editorial Sub-kicker */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-amber-400 uppercase mb-3">
          <Compass className="h-4 w-4" />
          <span>Curated Cinematic Discovery Engine</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-cinematic text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-100 mb-4">
          Describe the feeling. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
            Unearth your next obsession.
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-sm sm:text-base text-neutral-400 mb-8 leading-relaxed font-light">
          State your mood, specific cinematic aesthetic, or beloved films. CineMatch
          reasons across film history, verified against live movie database metadata.
        </p>

        {/* Search & Prompt Form */}
        <form onSubmit={handleSubmit} className="text-left space-y-4">
          {/* Main Input Box */}
          <div className="relative rounded-2xl border border-neutral-800 bg-neutral-900/90 p-4 shadow-2xl backdrop-blur-xl transition-all focus-within:border-amber-500/80 focus-within:ring-1 focus-within:ring-amber-500/50">
            {/* Quick Industry Switcher Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-neutral-800/80">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-amber-400" />
                <span>Film Industry / Origin</span>
              </span>
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-neutral-950 border border-neutral-800">
                {[
                  { label: 'All Cinema', value: 'all' },
                  { label: 'Hollywood', value: 'hollywood' },
                  { label: 'Bollywood', value: 'bollywood' },
                ].map((opt) => {
                  const isSelected = (filters.industry || 'all') === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFilters({ ...filters, industry: opt.value })}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-neutral-950 font-semibold shadow-sm'
                          : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Your Mood, Aesthetic, or Narrative Wish
            </label>
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A slow-burn, atmospheric mystery with breathtaking cinematography, philosophical stakes, and an unforgettable score..."
              className="w-full bg-transparent text-sm sm:text-base text-neutral-100 placeholder-neutral-500 focus:outline-none resize-none leading-relaxed"
            />

            {/* Reference Movies Loved Section */}
            <div className="pt-3 border-t border-neutral-800/80">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs text-neutral-400 font-medium flex items-center gap-1.5">
                  <Film className="h-3.5 w-3.5 text-amber-500" />
                  Grounded by movies you loved:
                </span>
                {favoriteMovies.map((movie) => (
                  <span
                    key={movie}
                    className="inline-flex items-center gap-1.5 rounded-md bg-neutral-800/90 border border-neutral-700/80 px-2.5 py-1 text-xs text-neutral-200"
                  >
                    <span>{movie}</span>
                    <button
                      type="button"
                      onClick={() => removeFavoriteMovie(movie)}
                      className="text-neutral-400 hover:text-rose-400 transition-colors"
                      title="Remove"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Autocomplete Movie Search from Database */}
              <div ref={searchContainerRef} className="relative">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                    <input
                      type="text"
                      value={movieQuery}
                      onChange={(e) => {
                        setMovieQuery(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => {
                        if (searchResults.length > 0) setShowDropdown(true);
                      }}
                      placeholder="Type a movie you enjoyed (e.g. Interstellar, Her, Parasite)..."
                      className="w-full rounded-lg bg-neutral-950/70 border border-neutral-800 py-2 pl-9 pr-8 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500/70"
                    />
                    {isSearchingMovies && (
                      <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-amber-500" />
                    )}
                  </div>
                </div>

                {/* Dropdown list of verified results */}
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-950 p-1.5 shadow-2xl">
                    <div className="px-2 py-1 text-[10px] uppercase font-mono text-neutral-500">
                      Verified Database Results
                    </div>
                    {searchResults.map((result) => (
                      <button
                        key={result.imdbID}
                        type="button"
                        onClick={() => addFavoriteMovie(result)}
                        className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-neutral-800/80 transition-colors"
                      >
                        <img
                          src={result.poster}
                          alt={result.title}
                          className="h-10 w-7 rounded object-cover bg-neutral-900 border border-neutral-800 flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=100&q=80';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-neutral-200 truncate">
                            {result.title}
                          </p>
                          <p className="text-[11px] text-neutral-400">
                            {result.year} · Film
                          </p>
                        </div>
                        <Plus className="h-4 w-4 text-amber-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-800/60">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-amber-300 transition-colors"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-amber-500" />
                <span>
                  {showFilters ? 'Hide Precision Filters' : 'Refine Filters'}
                </span>
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-neutral-950 shadow-lg shadow-amber-500/20 transition-all hover:from-amber-400 hover:to-amber-500 hover:shadow-amber-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-neutral-950" />
                    <span>Curating CineMatch...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-neutral-950" />
                    <span>Find My CineMatch</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Precision Filters Component */}
          <FilterBar
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
            isOpen={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
          />
        </form>

        {/* Quick Mood Inspiration Triggers */}
        <div className="mt-6 text-left">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
            Instant Mood Inspirations:
          </p>
          <div className="flex flex-wrap gap-2">
            {MOOD_PRESETS.map((preset) => (
              <button
                key={preset.title}
                type="button"
                onClick={() => applyPreset(preset.prompt)}
                className="rounded-lg bg-neutral-900/60 border border-neutral-800 px-3 py-1.5 text-xs text-neutral-300 transition-all hover:border-amber-500/50 hover:bg-neutral-800 hover:text-amber-200 cursor-pointer"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
