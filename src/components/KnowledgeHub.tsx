import React, { useState } from 'react';
import { BookOpen, Brain, Target, BarChart3, ShieldCheck, Zap, ChevronLeft, Loader2, Search } from 'lucide-react';
import Markdown from 'react-markdown';
import { getTradingKnowledge } from '../services/gemini';
import { cn } from '../lib/utils';

const categories = [
  {
    title: "Technical Analysis",
    icon: <BarChart3 className="w-5 h-5" />,
    color: "text-blue-400",
    topics: ["Moving Averages (SMA/EMA)", "RSI & Oscillators", "MACD Divergence", "Support & Resistance", "Candlestick Patterns", "Fibonacci Retracements"]
  },
  {
    title: "Trading Psychology",
    icon: <Brain className="w-5 h-5" />,
    color: "text-purple-400",
    topics: ["Overcoming FOMO", "Revenge Trading", "Emotional Discipline", "The Zone (Mark Douglas)", "Patience & Execution"]
  },
  {
    title: "Risk Management",
    icon: <ShieldCheck className="w-5 h-5" />,
    color: "text-emerald-400",
    topics: ["Position Sizing", "Risk to Reward (R:R)", "Drawdown Recovery", "Kelly Criterion", "Stop Loss Strategies"]
  },
  {
    title: "Fundamental Analysis",
    icon: <Zap className="w-5 h-5" />,
    color: "text-yellow-400",
    topics: ["Interest Rates & Forex", "NFP & Economic Data", "Earnings Reports", "Macroeconomics", "Market Sentiment"]
  },
  {
    title: "World Class Strategies",
    icon: <Target className="w-5 h-5" />,
    color: "text-red-400",
    topics: ["Turtle Trading System", "Wyckoff Method", "Elliott Wave Theory", "ICT Concepts", "Mean Reversion"]
  }
];

export const KnowledgeHub: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectTopic = async (topic: string) => {
    setSelectedTopic(topic);
    setContent('');
    setIsLoading(true);
    try {
      const result = await getTradingKnowledge(topic);
      setContent(result || 'Failed to load content.');
    } catch (error) {
      console.error(error);
      setContent('Error fetching knowledge base.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    handleSelectTopic(searchQuery);
  };

  if (selectedTopic) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <button 
          onClick={() => setSelectedTopic(null)}
          className="flex items-center gap-2 text-neutral-400 hover:text-emerald-500 transition-colors text-sm font-mono"
        >
          <ChevronLeft className="w-4 h-4" /> BACK TO HUB
        </button>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-neutral-800 pb-4">{selectedTopic}</h2>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-500 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              <p className="font-mono text-sm">Consulting world-class trading knowledge...</p>
            </div>
          ) : (
            <div className="markdown-body text-neutral-300">
              <Markdown>{content}</Markdown>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-mono uppercase tracking-widest">World Class Knowledge Hub</h2>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any trading concept..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-emerald-500">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {categories.map((category, i) => (
          <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-neutral-800 bg-neutral-950/50 flex items-center gap-3">
              <div className={category.color}>{category.icon}</div>
              <h3 className="font-bold text-neutral-200">{category.title}</h3>
            </div>
            <div className="p-2 flex-1">
              <ul className="space-y-1">
                {category.topics.map((topic, j) => (
                  <li key={j}>
                    <button 
                      onClick={() => handleSelectTopic(topic)}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800 transition-colors flex items-center justify-between group"
                    >
                      {topic}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px]">READ →</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

