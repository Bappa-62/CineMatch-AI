import React, { useState } from 'react';
import {
  Bookmark,
  Check,
  Star,
  Sparkles,
  Info,
  Clock,
  Film,
  Award,
  Share2,
} from 'lucide-react';
import { MovieMatch } from '../types/movie';
import { SocialShareModal } from './SocialShareModal';

interface MovieCardProps {
  movie: MovieMatch;
  isWatchlisted: boolean;
  onToggleWatchlist: (movie: MovieMatch) => void;
  onOpenDetails: (movie: MovieMatch) => void;
  onRateMovie: (movie: MovieMatch) => void;
  userRating?: number;
  onFindSimilar: (movie: MovieMatch) => void;
  index: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isWatchlisted,
  onToggleWatchlist,
  onOpenDetails,
  onRateMovie,
  userRating,
  onFindSimilar,
  index,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleOpenShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareOpen(true);
  };

  return (
    <article className="group relative flex flex-col md:flex-row rounded-2xl border border-neutral-800/80 bg-neutral-900/60 transition-all duration-300 hover:border-amber-500/40 hover:bg-neutral-900/90 hover:shadow-2xl hover:shadow-amber-950/20 overflow-hidden">
      {/* Poster Column */}
      <div className="relative md:w-64 lg:w-72 flex-shrink-0 bg-neutral-950 overflow-hidden">
        <div className="relative aspect-[2/3] w-full h-full min-h-[340px]">
          {/* Skeleton placeholder while loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-neutral-900 animate-pulse flex items-center justify-center">
              <Film className="h-8 w-8 text-neutral-800" />
            </div>
          )}
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
              setImageLoaded(true);
            }}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/30 md:hidden" />

          {/* Match Score Badge (top corner) */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-md bg-neutral-950/90 border border-amber-500/40 px-2.5 py-1 backdrop-blur-md shadow-lg">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-mono text-xs font-bold text-amber-300">
              {movie.matchScore}% MATCH
            </span>
          </div>

          {/* Quick Share button */}
          <button
            type="button"
            onClick={handleOpenShare}
            title="Share recommendation & pre-filled summary"
            className="absolute top-3 right-3 rounded-md bg-neutral-950/80 border border-neutral-800 p-1.5 text-neutral-400 hover:text-amber-300 hover:border-amber-500/50 backdrop-blur-md transition-colors cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Content Column */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 lg:p-7">
        <div className="space-y-3">
          {/* Header Row: Title & Release Year */}
          <div>
            <div className="flex flex-wrap items-baseline gap-2 mb-1">
              <h2 className="font-cinematic text-xl sm:text-2xl font-bold text-neutral-100 group-hover:text-amber-200 transition-colors">
                {movie.title}
              </h2>
              <span className="text-base text-neutral-400 font-normal">
                ({movie.year})
              </span>
            </div>

            {/* Clean Typographic Metadata (Strict Zero-Pill Discipline) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 font-medium">
              <span>{movie.runtime}</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>{movie.rated}</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="text-neutral-300">
                {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
              </span>
              {movie.director && (
                <>
                  <span aria-hidden="true" className="text-neutral-600">·</span>
                  <span>Dir. {movie.director}</span>
                </>
              )}
            </div>
          </div>

          {/* Ratings & Accolades Row */}
          <div className="flex flex-wrap items-center gap-4 py-2 border-y border-neutral-800/80 text-xs">
            {/* IMDb Rating */}
            <div className="flex items-center gap-1.5 font-mono">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-neutral-100">
                {movie.imdbRating}
              </span>
              <span className="text-neutral-500">IMDb</span>
            </div>

            {/* Rotten Tomatoes */}
            {movie.ratings?.rottenTomatoes && (
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-rose-400 font-bold">🍅</span>
                <span className="font-bold text-neutral-100">
                  {movie.ratings.rottenTomatoes}
                </span>
                <span className="text-neutral-500">Tomatometer</span>
              </div>
            )}

            {/* Metascore */}
            {movie.ratings?.metacritic && (
              <div className="flex items-center gap-1.5 font-mono">
                <span className="rounded bg-emerald-900/60 border border-emerald-700/60 px-1 py-0.2 text-[10px] font-bold text-emerald-300">
                  {movie.ratings.metacritic.replace('/100', '')}
                </span>
                <span className="text-neutral-500">Metascore</span>
              </div>
            )}

            {/* User Personal Rating if rated */}
            {userRating && (
              <div className="flex items-center gap-1.5 font-mono text-amber-300 bg-amber-950/40 border border-amber-800/40 rounded px-2 py-0.5 ml-auto">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>Your rating: {userRating}/10</span>
              </div>
            )}
          </div>

          {/* Personalized Grounded AI Match Reason */}
          <div className="rounded-xl border border-amber-900/30 bg-gradient-to-br from-amber-950/20 via-neutral-900/40 to-neutral-950 p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Sparkles className="h-3 w-3" />
              <span>Why This Matches Your Prompt</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-light">
              {movie.matchReason}
            </p>
          </div>

          {/* Verified Plot Synopsis */}
          <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed">
            {movie.plot}
          </p>

          {/* Mood Keywords & Discussion Highlights */}
          {movie.moodKeywords && movie.moodKeywords.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-400 pt-1">
              <span className="text-neutral-500 font-mono">Aesthetic:</span>
              {movie.moodKeywords.map((tag, idx) => (
                <span key={tag} className="text-neutral-300">
                  {tag}
                  {idx < movie.moodKeywords.length - 1 && (
                    <span className="text-neutral-600 ml-2" aria-hidden="true">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}

          {/* Cast */}
          {movie.actors && movie.actors.length > 0 && (
            <p className="text-xs text-neutral-400">
              <span className="text-neutral-500">Starring:</span>{' '}
              {movie.actors.slice(0, 3).join(', ')}
            </p>
          )}
        </div>

        {/* Action Controls Toolbar */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-800/80">
          <div className="flex flex-wrap items-center gap-2">
            {/* Watchlist Toggle */}
            <button
              type="button"
              onClick={() => onToggleWatchlist(movie)}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                isWatchlisted
                  ? 'bg-amber-500 text-neutral-950 font-semibold shadow-md shadow-amber-500/20'
                  : 'bg-neutral-800/80 text-neutral-200 border border-neutral-700/60 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              {isWatchlisted ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>In Watchlist</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>Add to Watchlist</span>
                </>
              )}
            </button>

            {/* Rate Movie Trigger */}
            <button
              type="button"
              onClick={() => onRateMovie(movie)}
              className="flex items-center gap-1.5 rounded-lg bg-neutral-800/60 border border-neutral-700/60 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-amber-300 transition-colors"
            >
              <Star className="h-3.5 w-3.5 text-amber-400" />
              <span>{userRating ? `Rated ${userRating}/10` : 'Rate Film'}</span>
            </button>

            {/* Find Similar Button */}
            <button
              type="button"
              onClick={() => onFindSimilar(movie)}
              className="flex items-center gap-1.5 rounded-lg bg-neutral-800/40 border border-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 transition-colors cursor-pointer"
            >
              <Film className="h-3.5 w-3.5 text-amber-500/80" />
              <span>More Like This</span>
            </button>

            {/* Social Share Button */}
            <button
              type="button"
              onClick={handleOpenShare}
              className="flex items-center gap-1.5 rounded-lg bg-neutral-800/40 border border-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-amber-300 hover:border-amber-500/50 hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5 text-amber-400" />
              <span>Share Summary</span>
            </button>
          </div>

          {/* Deep Dive Modal Trigger */}
          <button
            type="button"
            onClick={() => onOpenDetails(movie)}
            className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors ml-auto cursor-pointer"
          >
            <Info className="h-3.5 w-3.5" />
            <span>Full Details & Trailer</span>
          </button>
        </div>
      </div>

      {/* Social Share Pre-filled Summary Modal */}
      <SocialShareModal
        movie={movie}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </article>
  );
};
