import React from 'react';
import {
  X,
  Star,
  Bookmark,
  Check,
  Play,
  Award,
  DollarSign,
  Film,
  ExternalLink,
  Sparkles,
  Clapperboard,
} from 'lucide-react';
import { MovieMatch } from '../types/movie';

interface MovieDetailModalProps {
  movie: MovieMatch | null;
  isOpen: boolean;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (movie: MovieMatch) => void;
  onRateMovie: (movie: MovieMatch) => void;
  userRating?: number;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  isOpen,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  onRateMovie,
  userRating,
}) => {
  if (!isOpen || !movie) return null;

  const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${movie.title} ${movie.year} official trailer`
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/85 backdrop-blur-md"
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Backdrop Ambient Banner */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-neutral-950">
          <img
            src={movie.backdrop || movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover opacity-25 filter blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 rounded-full bg-neutral-950/80 border border-neutral-700/80 p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Match Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-md bg-neutral-950/90 border border-amber-500/50 px-3 py-1 shadow-lg">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="font-mono text-xs font-bold text-amber-300">
              {movie.matchScore}% CineMatch Precision
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="relative px-5 pb-8 sm:px-8 -mt-24 sm:-mt-32">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Poster thumbnail */}
            <div className="w-36 sm:w-52 flex-shrink-0 mx-auto sm:mx-0 shadow-2xl rounded-xl overflow-hidden border border-neutral-700/80 bg-neutral-950">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>

            {/* Info details */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="font-cinematic text-2xl sm:text-3xl font-extrabold text-neutral-100">
                  {movie.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-400 mt-1 font-medium">
                  <span>{movie.year}</span>
                  <span aria-hidden="true" className="text-neutral-600">·</span>
                  <span>{movie.runtime}</span>
                  <span aria-hidden="true" className="text-neutral-600">·</span>
                  <span className="rounded bg-neutral-800/80 px-1.5 py-0.2 text-neutral-300 text-xs">
                    {movie.rated}
                  </span>
                  <span aria-hidden="true" className="text-neutral-600">·</span>
                  <span className="text-neutral-300">
                    {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
                  </span>
                </div>
              </div>

              {/* Verified Ratings */}
              <div className="flex flex-wrap items-center gap-4 py-2 border-y border-neutral-800 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-neutral-200">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{movie.imdbRating}</span>
                  <span className="text-neutral-500">IMDb</span>
                </div>
                {movie.ratings?.rottenTomatoes && (
                  <div className="flex items-center gap-1.5 text-neutral-200">
                    <span>🍅</span>
                    <span className="font-bold">
                      {movie.ratings.rottenTomatoes}
                    </span>
                    <span className="text-neutral-500">Rotten Tomatoes</span>
                  </div>
                )}
                {movie.ratings?.metacritic && (
                  <div className="flex items-center gap-1.5 text-neutral-200">
                    <span className="rounded bg-emerald-900/60 px-1 py-0.2 text-[10px] text-emerald-300">
                      {movie.ratings.metacritic}
                    </span>
                    <span className="text-neutral-500">Metascore</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onToggleWatchlist(movie)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                    isWatchlisted
                      ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                      : 'bg-neutral-800 text-neutral-100 hover:bg-neutral-700'
                  }`}
                >
                  {isWatchlisted ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Saved in Watchlist</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4" />
                      <span>Add to Watchlist</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onRateMovie(movie)}
                  className="flex items-center gap-2 rounded-xl bg-neutral-800/80 border border-neutral-700 px-4 py-2 text-xs sm:text-sm font-medium text-neutral-200 hover:bg-neutral-700 hover:text-amber-300 transition-colors"
                >
                  <Star className="h-4 w-4 text-amber-400" />
                  <span>
                    {userRating ? `Your Rating: ${userRating}/10` : 'Rate Movie'}
                  </span>
                </button>

                {/* External Trailer Link */}
                <a
                  href={trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-neutral-800/40 border border-neutral-700/60 px-4 py-2 text-xs sm:text-sm font-medium text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors"
                >
                  <Play className="h-4 w-4 text-rose-500 fill-rose-500" />
                  <span>Watch Trailer</span>
                  <ExternalLink className="h-3 w-3 text-neutral-500" />
                </a>
              </div>
            </div>
          </div>

          {/* Full Plot & Grounding Details */}
          <div className="mt-6 space-y-5 text-xs sm:text-sm">
            {/* AI Curated Reason */}
            <div className="rounded-xl border border-amber-900/40 bg-gradient-to-r from-amber-950/20 to-neutral-950 p-4">
              <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>The Curator’s Take</span>
              </h4>
              <p className="text-neutral-200 leading-relaxed font-light">
                {movie.matchReason}
              </p>
            </div>

            {/* Synopsis */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Synopsis
              </h4>
              <p className="text-neutral-300 leading-relaxed font-light">
                {movie.plot}
              </p>
            </div>

            {/* Credits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-neutral-800">
              <div>
                <span className="text-neutral-500 block text-xs font-mono mb-0.5">
                  Director
                </span>
                <span className="text-neutral-200 font-medium">
                  {movie.director}
                </span>
              </div>
              {movie.writer && (
                <div>
                  <span className="text-neutral-500 block text-xs font-mono mb-0.5">
                    Screenplay
                  </span>
                  <span className="text-neutral-200 font-medium">
                    {movie.writer}
                  </span>
                </div>
              )}
              {movie.actors && movie.actors.length > 0 && (
                <div className="sm:col-span-2">
                  <span className="text-neutral-500 block text-xs font-mono mb-0.5">
                    Lead Cast
                  </span>
                  <span className="text-neutral-200 font-medium">
                    {movie.actors.join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Accolades & Box Office */}
            {(movie.awards || movie.boxOffice) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-neutral-800 text-xs">
                {movie.awards && (
                  <div className="flex items-start gap-2">
                    <Award className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-neutral-500 font-mono block">
                        Awards & Recognition
                      </span>
                      <span className="text-neutral-300">{movie.awards}</span>
                    </div>
                  </div>
                )}
                {movie.boxOffice && (
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-neutral-500 font-mono block">
                        Worldwide Box Office
                      </span>
                      <span className="text-neutral-300">{movie.boxOffice}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Streaming Info */}
            {movie.streamingInfo && (
              <div className="pt-2 text-xs text-neutral-400">
                <span className="text-neutral-500 font-mono">
                  Streaming Availability:
                </span>{' '}
                <span className="text-neutral-300">{movie.streamingInfo}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
