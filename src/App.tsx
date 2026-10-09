import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Clapperboard,
  Film,
  Bookmark,
  Star,
  SlidersHorizontal,
  Compass,
  AlertCircle,
  Loader2,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { MovieMatch, WatchlistItem, RecommendationResponse } from './types/movie';
import { INITIAL_FEATURED_MOVIES } from './data/initialRecommendations';
import { Navbar } from './components/Navbar';
import { SearchHero } from './components/SearchHero';
import { FilterState } from './components/FilterBar';
import { MovieCard } from './components/MovieCard';
import { MovieDetailModal } from './components/MovieDetailModal';
import { RatingModal } from './components/RatingModal';
import { CuratorChat } from './components/CuratorChat';
import { WatchlistView } from './components/WatchlistView';

const LOCAL_STORAGE_WATCHLIST_KEY = 'cinematch_ai_watchlist';

const LOADING_CINETEXTS = [
  'Querying film archives & verified database metadata...',
  'Evaluating directorial signatures & thematic resonance...',
  'Analyzing cinematography, pacing, and emotional frequency...',
  'Grounding recommendation reasoning against verified metadata...',
  'Curating your bespoke cinematic experience...',
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'discover' | 'watchlist' | 'ratings'>('discover');
  const [movies, setMovies] = useState<MovieMatch[]>(INITIAL_FEATURED_MOVIES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [detectedMood, setDetectedMood] = useState<string>('Atmospheric & Cerebral Cinema');
  const [curatorReply, setCuratorReply] = useState<string>(
    'Welcome to CineMatch AI. Below is a curated premiere selection of visually stunning, narratively ambitious films that balance psychological depth with unforgettable craft.'
  );
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([
    'Looking for something with faster, adrenaline-fueled pacing?',
    'Prefer older classic cinema before the year 2000?',
    'Lean deeper into slow-burn atmospheric mysteries?',
  ]);

  // Watchlist persisted state
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_WATCHLIST_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading watchlist from localStorage:', e);
    }
    // Initial pre-seed for smooth first-run demonstration
    return [
      {
        movie: INITIAL_FEATURED_MOVIES[0],
        addedAt: Date.now() - 3600000 * 24,
        status: 'watched',
        userRating: 9,
        userReview: 'Mind-boggling concept executed with jaw-dropping practical effects and Hans Zimmer mastery.',
        favorite: true,
      },
      {
        movie: INITIAL_FEATURED_MOVIES[1],
        addedAt: Date.now() - 3600000 * 12,
        status: 'want_to_watch',
        favorite: false,
      },
    ];
  });

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    genres: [],
    decade: '',
    minRating: 0,
    maxRuntime: 0,
    pacing: '',
    tone: '',
    industry: 'all',
  });

  // Modals state
  const [detailModalMovie, setDetailModalMovie] = useState<MovieMatch | null>(null);
  const [ratingModalMovie, setRatingModalMovie] = useState<MovieMatch | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync watchlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_WATCHLIST_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.error('Error saving watchlist to localStorage:', e);
    }
  }, [watchlist]);

  // Loading text rotation
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingTextIndex((prev) => (prev + 1) % LOADING_CINETEXTS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Search Recommendation Handler
  const handleSearch = async (params: {
    prompt: string;
    favoriteMovies: string[];
    filters: FilterState;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: params.prompt,
          industry: params.filters.industry || 'all',
          favoriteMovies: params.favoriteMovies,
          genres: params.filters.genres,
          decade: params.filters.decade,
          minRating: params.filters.minRating,
          maxRuntime: params.filters.maxRuntime,
          pacing: params.filters.pacing,
          tone: params.filters.tone,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate recommendations from server');
      }

      const data: RecommendationResponse = await res.json();

      if (data.recommendations && data.recommendations.length > 0) {
        setMovies(data.recommendations);
        setCuratorReply(data.conversationReply);
        setDetectedMood(data.detectedMood);
        setFollowUpQuestions(data.followUpQuestions || []);
        setActiveTab('discover');

        // Smooth scroll to recommendations section
        setTimeout(() => {
          const recElement = document.getElementById('curated-results-section');
          if (recElement) {
            recElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      } else {
        throw new Error('No movies matched the criteria');
      }
    } catch (err: any) {
      console.error('Recommendation fetch error:', err);
      setErrorMessage(
        'We encountered a temporary delay connecting to the movie database. Showing our premier verified collection below.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Watchlist Toggle
  const handleToggleWatchlist = (movie: MovieMatch) => {
    setWatchlist((prev) => {
      const exists = prev.some((item) => item.movie.id === movie.id);
      if (exists) {
        return prev.filter((item) => item.movie.id !== movie.id);
      } else {
        return [
          {
            movie,
            addedAt: Date.now(),
            status: 'want_to_watch',
          },
          ...prev,
        ];
      }
    });
  };

  // Watchlist item status toggle
  const handleToggleWatchlistStatus = (movieId: string) => {
    setWatchlist((prev) =>
      prev.map((item) => {
        if (item.movie.id === movieId) {
          const nextStatus = item.status === 'watched' ? 'want_to_watch' : 'watched';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  // Remove from watchlist
  const handleRemoveFromWatchlist = (movieId: string) => {
    setWatchlist((prev) => prev.filter((item) => item.movie.id !== movieId));
  };

  // Save Rating
  const handleSaveRating = (params: {
    movie: MovieMatch;
    rating: number;
    review: string;
    isFavorite: boolean;
  }) => {
    setWatchlist((prev) => {
      const existingIndex = prev.findIndex((i) => i.movie.id === params.movie.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          userRating: params.rating,
          userReview: params.review,
          favorite: params.isFavorite,
          status: 'watched',
        };
        return updated;
      } else {
        return [
          {
            movie: params.movie,
            addedAt: Date.now(),
            status: 'watched',
            userRating: params.rating,
            userReview: params.review,
            favorite: params.isFavorite,
          },
          ...prev,
        ];
      }
    });
  };

  // "Find Similar" Quick Pivot
  const handleFindSimilar = (movie: MovieMatch) => {
    handleSearch({
      prompt: `Movies that share the exact visual aesthetic, emotional resonance, and high-caliber direction of "${movie.title}" (${movie.year}).`,
      favoriteMovies: [`${movie.title} (${movie.year})`],
      filters: {
        genres: movie.genre || [],
        decade: '',
        minRating: 7.5,
        maxRuntime: 0,
        pacing: '',
        tone: '',
        industry: filters.industry || 'all',
      },
    });
  };

  // Count items with rating
  const ratedCount = watchlist.filter((item) => item.userRating !== undefined).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        watchlistCount={watchlist.length}
        ratingsCount={ratedCount}
        onResetSearch={() => {
          setMovies(INITIAL_FEATURED_MOVIES);
          setDetectedMood('Atmospheric & Cerebral Cinema');
        }}
      />

      <main className="flex-1">
        {activeTab === 'discover' && (
          <div>
            {/* Search Hero & Controls */}
            <SearchHero
              onSearch={handleSearch}
              isLoading={isLoading}
              filters={filters}
              setFilters={setFilters}
            />

            {/* Error banner if any */}
            {errorMessage && (
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
                <div className="flex items-center gap-2 rounded-xl bg-amber-950/40 border border-amber-800/60 p-4 text-xs text-amber-300">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Results Section */}
            <section
              id="curated-results-section"
              className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
            >
              {/* Curator Vibe Bar */}
              <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-sm">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Curated Selection For: {detectedMood}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light max-w-3xl">
                    {curatorReply}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto font-mono text-xs text-neutral-400">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Verified Database Grounding</span>
                </div>
              </div>

              {/* Movie Cards Showcase Grid */}
              {isLoading ? (
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-16 text-center space-y-4">
                  <Loader2 className="h-10 w-10 animate-spin text-amber-500 mx-auto" />
                  <h3 className="font-cinematic text-xl font-bold text-neutral-200">
                    Curating Cinematic Matches
                  </h3>
                  <p className="text-sm font-mono text-amber-400/90 h-6 transition-all duration-300">
                    {LOADING_CINETEXTS[loadingTextIndex]}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {movies.map((movie, index) => {
                    const isWatchlisted = watchlist.some((i) => i.movie.id === movie.id);
                    const userItem = watchlist.find((i) => i.movie.id === movie.id);

                    return (
                      <MovieCard
                        key={movie.id || index}
                        movie={movie}
                        index={index}
                        isWatchlisted={isWatchlisted}
                        onToggleWatchlist={handleToggleWatchlist}
                        onOpenDetails={setDetailModalMovie}
                        onRateMovie={setRatingModalMovie}
                        userRating={userItem?.userRating}
                        onFindSimilar={handleFindSimilar}
                      />
                    );
                  })}
                </div>
              )}

              {/* Conversational Cinephile Follow-Up Desk */}
              {!isLoading && (
                <CuratorChat
                  initialReply={curatorReply}
                  initialFollowUps={followUpQuestions}
                  currentMovies={movies}
                  onRefineRecommendation={(query) => {
                    handleSearch({
                      prompt: query,
                      favoriteMovies: [],
                      filters,
                    });
                  }}
                />
              )}
            </section>
          </div>
        )}

        {/* Watchlist Tab */}
        {activeTab === 'watchlist' && (
          <WatchlistView
            watchlist={watchlist}
            onRemove={handleRemoveFromWatchlist}
            onToggleStatus={handleToggleWatchlistStatus}
            onRateMovie={setRatingModalMovie}
            onOpenDetails={setDetailModalMovie}
            onDiscoverMore={() => setActiveTab('discover')}
          />
        )}

        {/* Ratings Tab */}
        {activeTab === 'ratings' && (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-500 mb-1">
                <Star className="h-4 w-4" />
                <span>Personal Film Journal</span>
              </div>
              <h1 className="font-cinematic text-2xl sm:text-3xl font-bold text-neutral-100 mb-2">
                Your Logged Ratings & Reviews
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400">
                A personal archive of your cinephile scores, impressions, and all-time favorites.
              </p>
            </div>

            {ratedCount === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-800 p-12 text-center space-y-3">
                <Star className="h-10 w-10 text-neutral-700 mx-auto" />
                <h3 className="font-cinematic text-lg font-bold text-neutral-300">
                  No ratings logged yet
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Click "Rate Film" on any movie card or in your watchlist to record your personal star rating and review.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('discover')}
                  className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors cursor-pointer mt-2"
                >
                  Discover Films to Rate
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {watchlist
                  .filter((item) => item.userRating !== undefined)
                  .map((item) => (
                    <div
                      key={item.movie.id}
                      className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex gap-4">
                          <img
                            src={item.movie.poster}
                            alt={item.movie.title}
                            className="h-28 w-20 rounded-lg object-cover bg-neutral-950 border border-neutral-800 flex-shrink-0 cursor-pointer"
                            onClick={() => setDetailModalMovie(item.movie)}
                          />
                          <div>
                            <h3
                              onClick={() => setDetailModalMovie(item.movie)}
                              className="font-cinematic text-base font-bold text-neutral-100 hover:text-amber-300 transition-colors cursor-pointer"
                            >
                              {item.movie.title}
                            </h3>
                            <p className="text-xs text-neutral-400">
                              {item.movie.year} · Dir. {item.movie.director}
                            </p>
                            <div className="flex items-center gap-1.5 mt-2 font-mono text-amber-400">
                              <Star className="h-4 w-4 fill-amber-400" />
                              <span className="font-bold text-sm">
                                {item.userRating}/10
                              </span>
                            </div>
                          </div>
                        </div>

                        {item.userReview && (
                          <div className="mt-3 rounded-lg bg-neutral-950 p-3 text-xs text-neutral-300 border border-neutral-800 italic">
                            "{item.userReview}"
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
                        <button
                          type="button"
                          onClick={() => setRatingModalMovie(item.movie)}
                          className="text-neutral-400 hover:text-amber-300 transition-colors cursor-pointer"
                        >
                          Edit Review
                        </button>
                        <button
                          type="button"
                          onClick={() => setDetailModalMovie(item.movie)}
                          className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-neutral-800/80 bg-neutral-950 py-8 text-center text-xs text-neutral-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Clapperboard className="h-4 w-4 text-amber-500" />
            <span className="font-cinematic font-bold tracking-wider text-neutral-300">
              CINEMATCH AI
            </span>
            <span>· Verified Cinema Discovery</span>
          </div>
          <p className="text-neutral-600">
            Powered by Google Gemini 3.8 & Verified Movie Database Metadata API
          </p>
        </div>
      </footer>

      {/* Modals */}
      <MovieDetailModal
        movie={detailModalMovie}
        isOpen={Boolean(detailModalMovie)}
        onClose={() => setDetailModalMovie(null)}
        isWatchlisted={
          detailModalMovie
            ? watchlist.some((i) => i.movie.id === detailModalMovie.id)
            : false
        }
        onToggleWatchlist={handleToggleWatchlist}
        onRateMovie={setRatingModalMovie}
        userRating={
          detailModalMovie
            ? watchlist.find((i) => i.movie.id === detailModalMovie.id)?.userRating
            : undefined
        }
      />

      <RatingModal
        movie={ratingModalMovie}
        isOpen={Boolean(ratingModalMovie)}
        onClose={() => setRatingModalMovie(null)}
        currentRating={
          ratingModalMovie
            ? watchlist.find((i) => i.movie.id === ratingModalMovie.id)?.userRating
            : 8
        }
        currentReview={
          ratingModalMovie
            ? watchlist.find((i) => i.movie.id === ratingModalMovie.id)?.userReview
            : ''
        }
        isFavorite={
          ratingModalMovie
            ? watchlist.find((i) => i.movie.id === ratingModalMovie.id)?.favorite
            : false
        }
        onSaveRating={handleSaveRating}
      />
    </div>
  );
}
