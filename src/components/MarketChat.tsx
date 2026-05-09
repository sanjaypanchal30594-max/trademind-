import React, { useState } from 'react';
import { Search, Send, Loader2, TrendingUp, Brain, Shield, MapPin } from 'lucide-react';
import Markdown from 'react-markdown';
import { analyzeMarket } from '../services/gemini';
import { cn } from '../lib/utils';

export const MarketChat: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setQuery('');
    setIsLoading(true);

    try {
      const result = await analyzeMarket(userMsg);
      setMessages(prev => [...prev, { role: 'ai', content: result || 'No data found.' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Error fetching market data.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
      <div className="p-4 border-bottom border-neutral-800 bg-neutral-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-mono uppercase tracking-widest text-neutral-400">Market Intelligence</h3>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500">
          <span className="flex items-center gap-1"><Brain className="w-3 h-3" /> AI Powered</span>
          <span className="flex items-center gap-1 text-emerald-500"><Shield className="w-3 h-3" /> Grounded</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-neutral-600 space-y-2">
            <Search className="w-8 h-8 opacity-20" />
            <p className="text-xs font-mono">Ask about live market trends, crypto, or stocks</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={cn(
            "max-w-[85%] p-3 rounded-lg text-sm",
            msg.role === 'user' ? "ml-auto bg-emerald-500/10 text-emerald-100 border border-emerald-500/20" : "bg-neutral-800 text-neutral-300 border border-neutral-700"
          )}>
            <div className="markdown-body">
              <Markdown>{msg.content}</Markdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-neutral-500 text-xs font-mono animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            Searching global markets...
          </div>
        )}
      </div>

      <form onSubmit={handleSearch} className="p-4 bg-neutral-900 border-t border-neutral-800">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search market data, predict trends..."
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-emerald-500">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
