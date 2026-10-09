import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  Sparkles,
  Star,
  ExternalLink,
} from 'lucide-react';
import { MovieMatch } from '../types/movie';

interface SocialShareModalProps {
  movie: MovieMatch | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  movie,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !movie) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://cinematch.app';

  // Construct engaging pre-filled summary text
  const genreStr = Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre;
  const quoteLine = movie.vibeQuote ? `\n💬 "${movie.vibeQuote}"` : '';
  const keywordsLine = movie.moodKeywords?.length
    ? `\n🏷️ Aesthetics: ${movie.moodKeywords.join(' · ')}`
    : '';

  const initialSummary = `🎬 CineMatch AI Recommendation: ${movie.title} (${movie.year})
⭐️ Match Score: ${movie.matchScore}% · IMDb: ${movie.imdbRating}/10
🎥 Dir. ${movie.director} · ${genreStr}
💡 Why It Matches: ${movie.matchReason}${quoteLine}${keywordsLine}

Discover your cinematic match at ${currentUrl}`;

  const [shareText, setShareText] = useState(initialSummary);
  const [copied, setCopied] = useState(false);

  // Sync if movie changes
  React.useEffect(() => {
    setShareText(initialSummary);
    setCopied(false);
  }, [movie]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      console.error('Failed to copy text:', e);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `CineMatch AI: ${movie.title} (${movie.year})`,
          text: shareText,
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `🎬 Watching "${movie.title}" (${movie.year}) - ${movie.matchScore}% match on CineMatch AI!\n\n"${movie.matchReason.slice(0, 160)}..."\n\n`
  )}&url=${encodeURIComponent(currentUrl)}`;

  const whatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    currentUrl
  )}&text=${encodeURIComponent(shareText)}`;

  const redditUrl = `https://www.reddit.com/submit?title=${encodeURIComponent(
    `CineMatch Recommendation: ${movie.title} (${movie.year}) - ${movie.matchScore}% Match`
  )}&text=${encodeURIComponent(shareText)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div
        className="relative w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl p-5 sm:p-6 space-y-5 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Share2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-cinematic text-lg font-bold text-neutral-100">
                Share CineMatch Recommendation
              </h3>
              <p className="text-xs text-neutral-400">
                Pre-filled cinephile summary ready for direct sharing
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Film Quick Glance */}
        <div className="flex items-center gap-3.5 rounded-xl bg-neutral-950 p-3 border border-neutral-800/80">
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-16 w-11 rounded object-cover bg-neutral-900 border border-neutral-800 flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=100&q=80';
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-cinematic text-sm font-bold text-neutral-100 truncate">
                {movie.title}
              </h4>
              <span className="text-xs text-neutral-400 font-mono">({movie.year})</span>
            </div>
            <p className="text-xs text-neutral-400 truncate">
              {movie.runtime} · {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
            </p>
            <div className="flex items-center gap-2 mt-1 text-[11px] font-mono">
              <span className="text-amber-400 font-semibold">{movie.matchScore}% Match</span>
              <span className="text-neutral-600">·</span>
              <span className="text-neutral-300">★ {movie.imdbRating} IMDb</span>
            </div>
          </div>
        </div>

        {/* Pre-filled Text Preview */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Generated Summary Text
            </label>
            <span className="text-[10px] text-neutral-500 font-mono">Editable preview</span>
          </div>
          <textarea
            rows={6}
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            className="w-full rounded-xl bg-neutral-950 border border-neutral-800 p-3.5 text-xs text-neutral-200 leading-relaxed font-mono focus:outline-none focus:border-amber-500 selection:bg-amber-500/30 resize-none"
          />
        </div>

        {/* Direct Social Platform Links */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Share Directly to Social Platforms
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* X / Twitter */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-neutral-950 border border-neutral-800 p-2.5 text-xs font-medium text-neutral-200 hover:border-amber-500/50 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>X (Twitter)</span>
            </a>

            {/* WhatsApp */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-neutral-950 border border-neutral-800 p-2.5 text-xs font-medium text-neutral-200 hover:border-emerald-500/50 hover:text-emerald-300 hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <span className="text-emerald-400 font-bold">💬</span>
              <span>WhatsApp</span>
            </a>

            {/* Telegram */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-neutral-950 border border-neutral-800 p-2.5 text-xs font-medium text-neutral-200 hover:border-sky-500/50 hover:text-sky-300 hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <span className="text-sky-400 font-bold">✈️</span>
              <span>Telegram</span>
            </a>

            {/* Reddit */}
            <a
              href={redditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-neutral-950 border border-neutral-800 p-2.5 text-xs font-medium text-neutral-200 hover:border-orange-500/50 hover:text-orange-300 hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <span className="text-orange-400 font-bold">🤖</span>
              <span>Reddit</span>
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-800">
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="flex items-center gap-1.5 rounded-xl bg-neutral-800/80 border border-neutral-700/80 px-3.5 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>System Share Sheet</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Done
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Summary Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
