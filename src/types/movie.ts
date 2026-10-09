export interface MovieMatch {
  id: string;
  title: string;
  year: string;
  rated: string;
  runtime: string;
  runtimeMinutes?: number;
  genre: string[];
  director: string;
  writer?: string;
  actors: string[];
  plot: string;
  poster: string;
  backdrop?: string;
  ratings: {
    imdb?: string;
    rottenTomatoes?: string;
    metacritic?: string;
  };
  imdbRating: string;
  imdbVotes?: string;
  imdbID: string;
  boxOffice?: string;
  awards?: string;
  
  // AI Personalized Grounding & Reasoning
  matchScore: number; // e.g. 96
  matchReason: string;
  moodKeywords: string[];
  vibeQuote?: string;
  discussionPoints?: string[];
  streamingInfo?: string;
  industry?: string;
}

export interface RecommendationRequest {
  prompt: string;
  industry?: string;
  favoriteMovies?: string[];
  genres?: string[];
  decade?: string;
  minRating?: number;
  maxRuntime?: number; // minutes
  pacing?: string;
  tone?: string;
  excludedTitles?: string[];
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    text: string;
  }>;
}

export interface RecommendationResponse {
  recommendations: MovieMatch[];
  conversationReply: string;
  followUpQuestions: string[];
  detectedMood: string;
  curatorNote?: string;
}

export interface WatchlistItem {
  movie: MovieMatch;
  addedAt: number;
  status: 'want_to_watch' | 'watched';
  userRating?: number; // 1-10
  userReview?: string;
  favorite?: boolean;
}

export interface MovieSearchResult {
  title: string;
  year: string;
  imdbID: string;
  poster: string;
  type: string;
}
