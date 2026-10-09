import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  Loader2,
  HelpCircle,
  Film,
  Compass,
} from 'lucide-react';
import { MovieMatch } from '../types/movie';

interface ChatMessage {
  id: string;
  sender: 'curator' | 'user';
  text: string;
  suggestedQuestions?: string[];
  alternativeMovie?: {
    title: string;
    year: string;
    reason: string;
  };
}

interface CuratorChatProps {
  initialReply: string;
  initialFollowUps: string[];
  currentMovies: MovieMatch[];
  onRefineRecommendation: (query: string) => void;
}

export const CuratorChat: React.FC<CuratorChatProps> = ({
  initialReply,
  initialFollowUps,
  currentMovies,
  onRefineRecommendation,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'curator',
      text: initialReply || 'I curated these selections to match your desired mood. Let me know if you would like to explore variations or dive into specific aspects of any film!',
      suggestedQuestions: initialFollowUps,
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Sync initial reply if parent updates recommendations
  React.useEffect(() => {
    if (initialReply) {
      setMessages((prev) => [
        ...prev,
        {
          id: `update-${Date.now()}`,
          sender: 'curator',
          text: initialReply,
          suggestedQuestions: initialFollowUps,
        },
      ]);
    }
  }, [initialReply, initialFollowUps]);

  const handleSend = async (questionText: string) => {
    const textToSend = questionText.trim();
    if (!textToSend || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          currentMovies,
          chatHistory: messages.slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            text: m.text,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const curatorMessage: ChatMessage = {
          id: `curator-${Date.now()}`,
          sender: 'curator',
          text: data.reply || 'Here is what I suggest for your cinematic journey.',
          suggestedQuestions: data.suggestedQuestions || [],
          alternativeMovie: data.alternativeMovie,
        };
        setMessages((prev) => [...prev, curatorMessage]);
      } else {
        throw new Error('Failed to fetch curator chat response');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'curator',
          text: "I encountered a minor glitch connecting to the cinema archives. However, you can explore any of the movies above or refine your filters!",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="mt-12 rounded-2xl border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-md overflow-hidden">
      {/* Header banner */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 px-5 py-4 bg-neutral-950/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-cinematic text-sm font-bold text-neutral-100">
              Conversational Cinephile Desk
            </h3>
            <p className="text-[11px] text-neutral-400">
              Ask follow-up questions, compare pacing, or refine the vibe
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-amber-400/80 bg-amber-950/40 border border-amber-800/30 rounded px-2 py-0.5">
          Grounded In Current Results
        </span>
      </div>

      {/* Message Feed */}
      <div className="p-5 space-y-4 max-h-[420px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-2xl rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-amber-600 text-neutral-950 font-medium rounded-br-xs'
                  : 'bg-neutral-800/80 text-neutral-200 border border-neutral-700/60 rounded-bl-xs'
              }`}
            >
              {msg.text}

              {/* Optional alternative movie callout */}
              {msg.alternativeMovie && (
                <div className="mt-3 rounded-lg bg-neutral-950/70 border border-amber-500/30 p-2.5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-amber-300">
                      Alternate Recommendation: {msg.alternativeMovie.title} (
                      {msg.alternativeMovie.year})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onRefineRecommendation(
                          `Find movies specifically like ${msg.alternativeMovie?.title} (${msg.alternativeMovie?.year})`
                        )
                      }
                      className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                    >
                      Curate around this
                    </button>
                  </div>
                  <p className="text-xs text-neutral-400">
                    {msg.alternativeMovie.reason}
                  </p>
                </div>
              )}
            </div>

            {/* Clickable Follow-Up Suggestions from Gemini */}
            {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5 pl-1">
                <span className="text-[10px] uppercase font-mono text-neutral-500 self-center mr-1">
                  Explore:
                </span>
                {msg.suggestedQuestions.map((q, qIdx) => (
                  <button
                    key={qIdx}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="flex items-center gap-1.5 rounded-lg bg-neutral-950/90 border border-neutral-800 px-3 py-1.5 text-xs text-neutral-300 hover:border-amber-500/60 hover:text-amber-200 transition-colors cursor-pointer"
                  >
                    <HelpCircle className="h-3 w-3 text-amber-400" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-amber-400 animate-pulse pl-1">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Consulting cinematic archives...</span>
          </div>
        )}
      </div>

      {/* Input box */}
      <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/70">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question (e.g. Which one is best for late night? Is Arrival too slow?)..."
            className="flex-1 rounded-xl bg-neutral-900 border border-neutral-800 px-3.5 py-2 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-neutral-950 font-semibold hover:bg-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
};
