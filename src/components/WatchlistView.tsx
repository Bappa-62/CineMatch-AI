import React, { useState } from 'react';
import {
  Bookmark,
  Check,
  Star,
  Trash2,
  Clock,
  Film,
  Heart,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { WatchlistItem, MovieMatch } from '../types/movie';

interface WatchlistViewProps {
  watchlist: WatchlistItem[];
  onRemove: (movieId: string) => void;
  onToggleStatus: (movieId: string) => void;
  onRateMovie: (movie: MovieMatch) => void;
  onOpenDetails: (movie: MovieMatch) => void;
  onDiscoverMore: () => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  watchlist,
  onRemove,
  onToggleStatus,
  onRateMovie,
  onOpenDetails,
  onDiscoverMore,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'want_to_watch' | 'watched' | 'favorites'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'score' | 'runtime'>('date');

  // Compute metrics
  const totalMinutes = watchlist.reduce(
    (sum, item) => sum + (item.movie.runtimeMinutes || 115),
    0
  );
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const watchedCount = watchlist.filter((i) => i.status === 'watched').length;
  const favoritesCount = watchlist.filter((i) => i.favorite).length;

  // Filter items
  const filteredItems = watchlist.filter((item) => {
    if (filterTab === 'want_to_watch') return item.status === 'want_to_watch';
    if (filterTab === 'watched') return item.status === 'watched';
    if (filterTab === 'favorites') return item.favorite;
    return true;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'rating') {
      const rateA = parseFloat(a.movie.imdbRating) || 0;
      const rateB = parseFloat(b.movie.imdbRating) || 0;
      return rateB - rateA;
    }
    if (sortBy === 'score') {
      return (b.movie.matchScore || 0) - (a.movie.matchScore || 0);
    }
    if (sortBy === 'runtime') {
      return (b.movie.runtimeMinutes || 0) - (a.movie.runtimeMinutes || 0);
    }
    // Default by date added
    return b.addedAt - a.addedAt;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header section with Stats Bar */}
      <div className="rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-neutral-950 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-500 mb-1">
              <Bookmark className="h-4 w-4" />
              <span>Personal Cinema Vault</span>
            </div>
            <h1 className="font-cinematic text-2xl sm:text-3xl font-bold text-neutral-100">
              Curated Watchlist & Cinema Log
            </h1>
          </div>

          <button
            type="button"
            onClick={onDiscoverMore}
            className="self-start sm:self-auto flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Discover More Films</span>
          </button>
        </div>

        {/* Stats Metrics (Zero-pill text separators) */}
        <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-medium text-neutral-400">
          <div className="flex items-center gap-2">
            <Film className="h-4 w-4 text-amber-400" />
            <span>
              <strong className="text-neutral-100 font-mono">
                {watchlist.length}
              </strong>{' '}
              Films in Vault
            </span>
          </div>
          <span className="text-neutral-700" aria-hidden="true">·</span>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <span>
              Total Runtime:{' '}
              <strong className="text-neutral-100 font-mono">
                {hours}h {minutes}m
              </strong>
            </span>
          </div>
          <span className="text-neutral-700" aria-hidden="true">·</span>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>
              <strong className="text-neutral-100 font-mono">
                {watchedCount}
              </strong>{' '}
              Watched
            </span>
          </div>
          <span className="text-neutral-700" aria-hidden="true">·</span>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-400" />
            <span>
              <strong className="text-neutral-100 font-mono">
                {favoritesCount}
              </strong>{' '}
              Favorites
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterTab === 'all'
                ? 'bg-neutral-800 text-amber-300 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All Films ({watchlist.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('want_to_watch')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterTab === 'want_to_watch'
                ? 'bg-neutral-800 text-amber-300 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Want to Watch ({watchlist.length - watchedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('watched')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterTab === 'watched'
                ? 'bg-neutral-800 text-amber-300 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Watched ({watchedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('favorites')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterTab === 'favorites'
                ? 'bg-neutral-800 text-amber-300 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Favorites ({favoritesCount})
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500 flex items-center gap-1">
            <ArrowUpDown className="h-3.5 w-3.5" />
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-neutral-200 focus:outline-none focus:border-amber-500 font-mono text-xs"
          >
            <option value="date">Recently Added</option>
            <option value="rating">IMDb Rating</option>
            <option value="score">CineMatch Score</option>
            <option value="runtime">Runtime (Longest)</option>
          </select>
        </div>
      </div>

      {/* Watchlist Grid */}
      {sortedItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-800 p-12 text-center space-y-3">
          <Film className="h-10 w-10 text-neutral-700 mx-auto" />
          <h3 className="font-cinematic text-lg font-bold text-neutral-300">
            No films found in this filter
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Add movies to your watchlist while browsing personalized recommendations or
            use the search flow above.
          </p>
          <button
            type="button"
            onClick={onDiscoverMore}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors mt-2 cursor-pointer"
          >
            <span>Explore CineMatch Discovery</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedItems.map((item) => (
            <div
              key={item.movie.id}
              className="group relative rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-4 transition-all duration-300 hover:border-amber-500/40 hover:bg-neutral-900 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-4">
                  {/* Poster Thumbnail */}
                  <img
                    src={item.movie.poster}
                    alt={item.movie.title}
                    className="h-28 w-20 rounded-lg object-cover bg-neutral-950 border border-neutral-800 flex-shrink-0 cursor-pointer"
                    onClick={() => onOpenDetails(item.movie)}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=100&q=80';
                    }}
                  />

                  {/* Meta info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3
                        onClick={() => onOpenDetails(item.movie)}
                        className="font-cinematic text-base font-bold text-neutral-100 hover:text-amber-300 transition-colors cursor-pointer truncate"
                      >
                        {item.movie.title}
                      </h3>
                      {item.favorite && (
                        <Heart className="h-4 w-4 fill-rose-500 text-rose-500 flex-shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-neutral-400">
                      {item.movie.year} · {item.movie.runtime}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 text-xs font-mono">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="h-3 w-3 fill-amber-400" />
                        <span>{item.movie.imdbRating}</span>
                      </div>
                      <span className="text-neutral-600">·</span>
                      <span className="text-neutral-400">
                        {item.movie.matchScore}% Match
                      </span>
                    </div>

                    {/* Status switch button */}
                    <button
                      type="button"
                      onClick={() => onToggleStatus(item.movie.id)}
                      className={`mt-2 flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        item.status === 'watched'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      <Check className="h-3 w-3" />
                      <span>
                        {item.status === 'watched' ? 'Watched' : 'Mark as Watched'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* User review / rating if present */}
                {(item.userRating || item.userReview) && (
                  <div className="mt-3 rounded-lg bg-neutral-950/80 border border-neutral-800 p-2.5 text-xs space-y-1">
                    {item.userRating && (
                      <div className="flex items-center gap-1 text-amber-300 font-mono font-medium">
                        <Star className="h-3 w-3 fill-amber-400" />
                        <span>Personal Score: {item.userRating}/10</span>
                      </div>
                    )}
                    {item.userReview && (
                      <p className="text-neutral-300 italic line-clamp-2">
                        "{item.userReview}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs">
                <button
                  type="button"
                  onClick={() => onRateMovie(item.movie)}
                  className="text-neutral-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Star className="h-3.5 w-3.5 text-amber-400" />
                  <span>{item.userRating ? 'Edit Rating' : 'Add Rating'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenDetails(item.movie)}
                    className="text-amber-400 hover:text-amber-300 transition-colors text-xs font-medium cursor-pointer"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(item.movie.id)}
                    className="text-neutral-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
