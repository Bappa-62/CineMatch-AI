import React, { useState } from 'react';
import { X, Star, Heart, Check } from 'lucide-react';
import { MovieMatch } from '../types/movie';

interface RatingModalProps {
  movie: MovieMatch | null;
  isOpen: boolean;
  onClose: () => void;
  currentRating?: number;
  currentReview?: string;
  isFavorite?: boolean;
  onSaveRating: (params: {
    movie: MovieMatch;
    rating: number;
    review: string;
    isFavorite: boolean;
  }) => void;
}

const RATING_DESCRIPTIONS: Record<number, string> = {
  10: 'Transcendental Masterpiece (10/10)',
  9: 'Phenomenal Cinema (9/10)',
  8: 'Excellent & Highly Memorable (8/10)',
  7: 'Very Good & Worthwhile (7/10)',
  6: 'Decent Watch (6/10)',
  5: 'Average Film (5/10)',
  4: 'Underwhelming (4/10)',
  3: 'Poor Execution (3/10)',
  2: 'Disappointing (2/10)',
  1: 'Waste of Runtime (1/10)',
};

export const RatingModal: React.FC<RatingModalProps> = ({
  movie,
  isOpen,
  onClose,
  currentRating = 8,
  currentReview = '',
  isFavorite = false,
  onSaveRating,
}) => {
  if (!isOpen || !movie) return null;

  const [rating, setRating] = useState<number>(currentRating || 8);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [review, setReview] = useState<string>(currentReview || '');
  const [favorite, setFavorite] = useState<boolean>(isFavorite || false);

  const activeRating = hoverRating !== null ? hoverRating : rating;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveRating({
      movie,
      rating,
      review: review.trim(),
      isFavorite: favorite,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div>
            <h3 className="font-cinematic text-lg font-bold text-neutral-100">
              Log & Rate Film
            </h3>
            <p className="text-xs text-neutral-400">
              {movie.title} ({movie.year})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star selector (1 to 10) */}
          <div className="text-center py-2">
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 mb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((starNum) => (
                <button
                  key={starNum}
                  type="button"
                  onMouseEnter={() => setHoverRating(starNum)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setRating(starNum)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    className={`h-5 w-5 sm:h-6 sm:w-6 ${
                      starNum <= activeRating
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : 'text-neutral-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            <p className="text-xs font-mono font-medium text-amber-300 h-5">
              {RATING_DESCRIPTIONS[activeRating] || `${activeRating}/10`}
            </p>
          </div>

          {/* Favorite toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-xs font-medium text-neutral-300 flex items-center gap-2">
              <Heart
                className={`h-4 w-4 ${
                  favorite ? 'fill-rose-500 text-rose-500' : 'text-neutral-500'
                }`}
              />
              Mark as All-Time Favorite
            </span>
            <button
              type="button"
              onClick={() => setFavorite(!favorite)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                favorite
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {favorite ? 'Favorited' : 'Favorite'}
            </button>
          </div>

          {/* Personal Review Note */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
              Personal Review / Cinephile Reflections
            </label>
            <textarea
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What stood out to you? The sound design, ending twist, or visual framing..."
              className="w-full rounded-xl bg-neutral-950 border border-neutral-800 p-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>Save Rating</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
