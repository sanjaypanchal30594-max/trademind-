import React, { useState } from 'react';
import { MarketChat } from './components/MarketChat';
import { StrategyLab } from './components/StrategyLab';
import { KnowledgeHub } from './components/KnowledgeHub';
import { VoiceAssistant } from './components/VoiceAssistant';
import { InteractiveChart } from './components/InteractiveChart';
import { BacktestEngine } from './components/BacktestEngine';
import { UserProfileView } from './components/UserProfile';
import { UserProvider } from './context/UserContext';
import { LayoutDashboard, FlaskConical, BookOpen, TrendingUp, Activity, Globe, Wallet, LineChart, TestTube2, User } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'charts' | 'backtest' | 'lab' | 'knowledge' | 'profile'>('dashboard');

  return (
    <UserProvider>
      <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-emerald-500/30">
        {/* Sidebar */}
        <nav className="fixed left-0 top-0 bottom-0 w-20 border-r border-neutral-800 bg-neutral-950 flex flex-col items-center py-8 gap-8 z-40">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <TrendingUp className="text-black w-6 h-6" />
          </div>
          
          <div className="flex flex-col gap-4">
            <NavIcon 
              icon={<LayoutDashboard />} 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
              label="Dashboard"
            />
            <NavIcon 
              icon={<LineChart />} 
              active={activeTab === 'charts'} 
              onClick={() => setActiveTab('charts')} 
              label="Charts"
            />
            <NavIcon 
              icon={<TestTube2 />} 
              active={activeTab === 'backtest'} 
              onClick={() => setActiveTab('backtest')} 
              label="Backtest"
            />
            <NavIcon 
              icon={<FlaskConical />} 
              active={activeTab === 'lab'} 
              onClick={() => setActiveTab('lab')} 
              label="Lab"
            />
            <NavIcon 
              icon={<BookOpen />} 
              active={activeTab === 'knowledge'} 
              onClick={() => setActiveTab('knowledge')} 
              label="Hub"
            />
          </div>

          <div className="mt-auto flex flex-col gap-4">
            <NavIcon 
              icon={<User />} 
              active={activeTab === 'profile'} 
              onClick={() => setActiveTab('profile')} 
              label="Profile"
            />
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors">
              <Globe className="w-4 h-4 text-neutral-400" />
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pl-20 min-h-screen">
          {/* Header */}
          <header className="h-16 border-b border-neutral-800 flex items-center justify-between px-8 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md z-30">
            <div className="flex items-center gap-4">
              <h1 className="text-sm font-mono uppercase tracking-[0.3em] text-neutral-400">TradeMind AI <span className="text-emerald-500">v1.0</span></h1>
              <div className="h-4 w-[1px] bg-neutral-800" />
              <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500">
                <Activity className="w-3 h-3 text-emerald-500" />
                SYSTEMS NOMINAL
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-mono text-neutral-500 uppercase">Market Status</span>
                <span className="text-xs font-mono text-emerald-500">OPEN • VOLATILITY HIGH</span>
              </div>
            </div>
          </header>

          <div className="p-8 max-w-7xl mx-auto space-y-8">
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <MarketChat />
                  </div>
                  <div className="space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                      <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-4">Live Watchlist</h3>
                      <div className="space-y-3">
                        <WatchlistItem symbol="BTC/USD" price="64,231.50" change="+2.4%" up />
                        <WatchlistItem symbol="EUR/USD" price="1.0842" change="-0.12%" />
                        <WatchlistItem symbol="NVDA" price="875.28" change="+1.8%" up />
                        <WatchlistItem symbol="GOLD" price="2,154.20" change="+0.45%" up />
                      </div>
                    </div>
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
                      <h3 className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-2">AI Signal Alert</h3>
                      <p className="text-sm text-neutral-300 leading-relaxed">
                        High probability bearish divergence detected on BTC 4H timeframe. RSI overbought with decreasing volume.
                      </p>
                      <button className="mt-4 w-full bg-emerald-500 text-black py-2 rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors">
                        VIEW ANALYSIS
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'charts' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <InteractiveChart />
              </div>
            )}

            {activeTab === 'backtest' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <BacktestEngine />
              </div>
            )}

            {activeTab === 'lab' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <StrategyLab />
              </div>
            )}

            {activeTab === 'knowledge' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <KnowledgeHub />
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <UserProfileView />
              </div>
            )}
          </div>
        </main>

        <VoiceAssistant />
      </div>
    </UserProvider>
  );
}


function NavIcon({ icon, active, onClick, label }: { icon: React.ReactElement, active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center transition-all relative group",
        active ? "bg-emerald-500/10 text-emerald-500" : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900"
      )}
    >
      {React.cloneElement(icon, { className: "w-5 h-5" } as React.HTMLAttributes<HTMLElement>)}
      {active && <div className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full" />}
      <div className="absolute left-full ml-4 px-2 py-1 bg-neutral-800 text-white text-[10px] font-mono rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        {label}
      </div>
    </button>
  );
}

function WatchlistItem({ symbol, price, change, up }: { symbol: string, price: string, change: string, up?: boolean }) {
  return (
    <div className="flex items-center justify-between p-2 rounded hover:bg-neutral-800 transition-colors cursor-pointer">
      <span className="text-sm font-mono font-bold">{symbol}</span>
      <div className="flex flex-col items-end">
        <span className="text-sm font-mono">{price}</span>
        <span className={cn("text-[10px] font-mono", up ? "text-emerald-500" : "text-red-500")}>
          {change}
        </span>
      </div>
    </div>
  );
}
