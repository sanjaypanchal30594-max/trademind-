import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { simulateBacktest } from '../services/gemini';
import { Play, Loader2, Save, BarChart2, TrendingDown, TrendingUp, Activity, Plus, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const BacktestEngine: React.FC = () => {
  const { profile, saveStrategy } = useUser();
  const [strategyName, setStrategyName] = useState('');
  const [assetInput, setAssetInput] = useState('');
  const [assets, setAssets] = useState<string[]>(['BTC/USD']);
  const [rules, setRules] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAddAsset = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (('key' in e && e.key === 'Enter') || e.type === 'click') {
      e.preventDefault();
      if (assetInput.trim() && !assets.includes(assetInput.trim().toUpperCase())) {
        setAssets([...assets, assetInput.trim().toUpperCase()]);
        setAssetInput('');
      }
    }
  };

  const handleRemoveAsset = (assetToRemove: string) => {
    setAssets(assets.filter(a => a !== assetToRemove));
  };

  const handleRunBacktest = async () => {
    if (!rules.trim() || !strategyName.trim() || assets.length === 0) return;
    setIsTesting(true);
    try {
      const report = await simulateBacktest(`Assets: ${assets.join(', ')}\nRules: ${rules}`, profile);
      setResults(report);
    } catch (error) {
      console.error(error);
      alert("Failed to run backtest. Please try again.");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveStrategy = () => {
    if (!rules || !strategyName || assets.length === 0) return;
    saveStrategy({
      id: Date.now().toString(),
      name: strategyName,
      asset: assets.join(', '),
      rules
    });
    alert("Strategy saved to profile!");
  };

  const chartData = results?.equityCurve?.map((val: number, i: number) => ({
    trade: i,
    equity: val
  })) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Configuration Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-mono uppercase tracking-widest">AI Backtester</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-neutral-500 uppercase">Strategy Name</label>
              <input 
                type="text" 
                value={strategyName}
                onChange={e => setStrategyName(e.target.value)}
                placeholder="e.g., Golden Cross Reversion"
                className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded p-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="text-xs font-mono text-neutral-500 uppercase">Target Assets (Stocks, Forex, Crypto)</label>
              <div className="flex gap-2 mt-1">
                <input 
                  type="text" 
                  value={assetInput}
                  onChange={e => setAssetInput(e.target.value)}
                  onKeyDown={handleAddAsset}
                  placeholder="e.g., AAPL, EUR/USD, ETH"
                  className="flex-1 bg-neutral-800 border border-neutral-700 rounded p-2 text-sm text-white focus:border-emerald-500 focus:outline-none uppercase"
                />
                <button 
                  onClick={handleAddAsset}
                  className="bg-neutral-800 border border-neutral-700 hover:border-emerald-500 p-2 rounded text-neutral-400 hover:text-emerald-500 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {assets.map(asset => (
                  <span key={asset} className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded text-xs font-mono">
                    {asset}
                    <button onClick={() => handleRemoveAsset(asset)} className="hover:text-white transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-neutral-500 uppercase">Trading Rules (Entry/Exit/Risk)</label>
              <textarea 
                value={rules}
                onChange={e => setRules(e.target.value)}
                placeholder="Enter conditions. e.g., 'Buy when 50 EMA crosses above 200 EMA. Stop loss at 2% below entry. Take profit at 4%.'"
                className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded p-2 text-sm text-white focus:border-emerald-500 focus:outline-none min-h-[150px] resize-none font-mono"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleRunBacktest}
                disabled={isTesting || !rules || !strategyName || assets.length === 0}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2 rounded flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
              >
                {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                RUN SIMULATION
              </button>
              <button 
                onClick={handleSaveStrategy}
                disabled={!rules || !strategyName || assets.length === 0}
                className="bg-neutral-800 hover:bg-neutral-700 text-white p-2 rounded border border-neutral-700 disabled:opacity-50 transition-colors"
                title="Save Strategy"
              >
                <Save className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-8">
        {results ? (
          <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard title="Win Rate" value={`${results.winRate}%`} icon={<BarChart2 className="w-4 h-4 text-emerald-500" />} />
              <MetricCard title="Net Profit" value={`${results.netProfit}%`} icon={<TrendingUp className="w-4 h-4 text-emerald-500" />} />
              <MetricCard title="Max Drawdown" value={`${results.maxDrawdown}%`} icon={<TrendingDown className="w-4 h-4 text-red-500" />} />
              <MetricCard title="Profit Factor" value={results.profitFactor.toString()} icon={<Activity className="w-4 h-4 text-emerald-500" />} />
            </div>

            {/* Equity Curve Chart */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 h-[300px]">
              <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-4">Simulated Equity Curve</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="trade" stroke="#525252" tick={{fontSize: 10, fontFamily: 'monospace'}} />
                  <YAxis domain={['auto', 'auto']} stroke="#525252" tick={{fontSize: 10, fontFamily: 'monospace'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
                    itemStyle={{ color: '#10b981', fontFamily: 'monospace' }}
                  />
                  <Line type="monotone" dataKey="equity" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* AI Analysis */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h3 className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-2">AI Performance Analysis</h3>
              <p className="text-sm text-neutral-300 leading-relaxed font-mono whitespace-pre-wrap">
                {results.analysis}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full bg-neutral-900/50 border border-neutral-800 border-dashed rounded-xl flex flex-col items-center justify-center text-neutral-500 min-h-[400px]">
            <Activity className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-mono text-sm">Configure and run a backtest to see results</p>
          </div>
        )}
      </div>
    </div>
  );
};

function MetricCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-neutral-500 uppercase">{title}</span>
        {icon}
      </div>
      <span className="text-2xl font-mono text-white">{value}</span>
    </div>
  );
}
