import React from 'react';
import { Film, Bookmark, Sparkles, Star, Clapperboard } from 'lucide-react';

interface NavbarProps {
  activeTab: 'discover' | 'watchlist' | 'ratings';
  setActiveTab: (tab: 'discover' | 'watchlist' | 'ratings') => void;
  watchlistCount: number;
  ratingsCount: number;
  onResetSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  watchlistCount,
  ratingsCount,
  onResetSearch,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <button
          onClick={() => {
            setActiveTab('discover');
            if (onResetSearch) onResetSearch();
          }}
          className="group flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/30 text-amber-400 group-hover:border-amber-400 transition-colors">
            <Clapperboard className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-cinematic text-lg font-bold tracking-widest text-neutral-100 group-hover:text-amber-200 transition-colors">
                CINEMATCH
              </span>
              <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider font-mono">
                AI
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 tracking-wider uppercase font-medium">
              Verified Cinema Discovery
            </p>
          </div>
        </button>

        {/* Clean Typographic Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'discover'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Discover</span>
          </button>

          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'watchlist'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            <span>Watchlist</span>
            {watchlistCount > 0 && (
              <span className="ml-1 text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 rounded px-1.5 py-0.2">
                {watchlistCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ratings')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'ratings'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
            }`}
          >
            <Star className="h-4 w-4" />
            <span>My Ratings</span>
            {ratingsCount > 0 && (
              <span className="ml-1 text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 rounded px-1.5 py-0.2">
                {ratingsCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
