import React, { useState, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ComposedChart, Cell } from 'recharts';
import { Settings2, LineChart as ChartIcon, MousePointer2, Save } from 'lucide-react';

// Generate mock OHLC data
const generateData = (days: number) => {
  let price = 50000;
  const data = [];
  for (let i = 0; i < days; i++) {
    const volatility = price * 0.02;
    const open = price + (Math.random() - 0.5) * volatility;
    const close = open + (Math.random() - 0.5) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.random() * 1000 + 500;
    price = close;
    
    data.push({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      open, high, low, close, volume,
      isUp: close >= open
    });
  }
  return data;
};

const calculateSMA = (data: any[], period: number) => {
  return data.map((d, i) => {
    if (i < period - 1) return { ...d, [`sma${period}`]: null };
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val.close, 0);
    return { ...d, [`sma${period}`]: sum / period };
  });
};

const calculateRSI = (data: any[], period: number = 14) => {
  let gains = 0, losses = 0;
  return data.map((d, i) => {
    if (i === 0) return { ...d, rsi: null };
    const change = d.close - data[i - 1].close;
    if (i < period) {
      if (change > 0) gains += change;
      else losses -= change;
      return { ...d, rsi: null };
    }
    if (i === period) {
      gains /= period;
      losses /= period;
    } else {
      gains = (gains * (period - 1) + (change > 0 ? change : 0)) / period;
      losses = (losses * (period - 1) + (change < 0 ? -change : 0)) / period;
    }
    const rs = losses === 0 ? 100 : gains / losses;
    const rsi = 100 - (100 / (1 + rs));
    return { ...d, rsi };
  });
};

export const InteractiveChart: React.FC = () => {
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(false);
  const [showRSI, setShowRSI] = useState(true);
  const [showEconData, setShowEconData] = useState(false);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState<{x1: number, y1: number, x2: number, y2: number}[]>([]);
  const [currentLine, setCurrentLine] = useState<{x1: number, y1: number, x2: number, y2: number} | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const rawData = useMemo(() => generateData(100), []);
  const chartData = useMemo(() => {
    let d = calculateSMA(rawData, 20);
    d = calculateSMA(d, 50);
    d = calculateRSI(d, 14);
    
    // Add mock economic data overlay
    if (showEconData) {
      d[20].econEvent = "Fed Rate Hike";
      d[50].econEvent = "CPI Report";
      d[80].econEvent = "NFP Data";
    }
    return d;
  }, [rawData, showEconData]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDrawing || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentLine({ x1: x, y1: y, x2: x, y2: y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !currentLine || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentLine({ ...currentLine, x2: x, y2: y });
  };

  const handleMouseUp = () => {
    if (isDrawing && currentLine) {
      setLines([...lines, currentLine]);
      setCurrentLine(null);
    }
  };

  const saveTemplate = () => {
    const template = { showSMA20, showSMA50, showRSI, showEconData };
    localStorage.setItem('tradeMind_chartTemplate', JSON.stringify(template));
    alert("Chart template saved!");
  };

  const loadTemplate = () => {
    const t = localStorage.getItem('tradeMind_chartTemplate');
    if (t) {
      const parsed = JSON.parse(t);
      setShowSMA20(parsed.showSMA20);
      setShowSMA50(parsed.showSMA50);
      setShowRSI(parsed.showRSI);
      setShowEconData(parsed.showEconData);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col h-[800px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ChartIcon className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-mono uppercase tracking-widest">Advanced Charting</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-neutral-800 p-1 rounded-lg">
            <button 
              onClick={() => setIsDrawing(!isDrawing)}
              className={`p-2 rounded ${isDrawing ? 'bg-emerald-500 text-black' : 'text-neutral-400 hover:text-white'}`}
              title="Draw Trendline"
            >
              <MousePointer2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setLines([])}
              className="p-2 text-neutral-400 hover:text-white text-xs font-mono"
              title="Clear Lines"
            >
              CLEAR
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs font-mono text-neutral-400 cursor-pointer">
              <input type="checkbox" checked={showSMA20} onChange={e => setShowSMA20(e.target.checked)} className="accent-emerald-500" /> SMA 20
            </label>
            <label className="flex items-center gap-2 text-xs font-mono text-neutral-400 cursor-pointer">
              <input type="checkbox" checked={showSMA50} onChange={e => setShowSMA50(e.target.checked)} className="accent-emerald-500" /> SMA 50
            </label>
            <label className="flex items-center gap-2 text-xs font-mono text-neutral-400 cursor-pointer">
              <input type="checkbox" checked={showRSI} onChange={e => setShowRSI(e.target.checked)} className="accent-emerald-500" /> RSI
            </label>
            <label className="flex items-center gap-2 text-xs font-mono text-neutral-400 cursor-pointer">
              <input type="checkbox" checked={showEconData} onChange={e => setShowEconData(e.target.checked)} className="accent-emerald-500" /> Econ Data
            </label>
          </div>

          <div className="flex gap-2">
            <button onClick={loadTemplate} className="text-xs font-mono text-neutral-400 hover:text-emerald-500 transition-colors">LOAD</button>
            <button onClick={saveTemplate} className="text-xs font-mono text-neutral-400 hover:text-emerald-500 transition-colors flex items-center gap-1">
              <Save className="w-3 h-3" /> SAVE
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        {/* Main Price Chart */}
        <div className="h-[60%] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="date" stroke="#525252" tick={{fontSize: 10}} hide />
              <YAxis domain={['auto', 'auto']} stroke="#525252" tick={{fontSize: 10, fontFamily: 'monospace'}} orientation="right" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
                itemStyle={{ fontFamily: 'monospace' }}
                labelStyle={{ color: '#a3a3a3', marginBottom: '4px' }}
              />
              <Line type="monotone" dataKey="close" stroke="#ffffff" strokeWidth={2} dot={false} isAnimationActive={false} />
              {showSMA20 && <Line type="monotone" dataKey="sma20" stroke="#3b82f6" strokeWidth={1.5} dot={false} isAnimationActive={false} />}
              {showSMA50 && <Line type="monotone" dataKey="sma50" stroke="#eab308" strokeWidth={1.5} dot={false} isAnimationActive={false} />}
              
              {/* Custom rendering for Economic Data markers would go here, simplified using scatter or custom dots in recharts */}
            </ComposedChart>
          </ResponsiveContainer>
          
          {/* Drawing Overlay */}
          <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {lines.map((line, i) => (
              <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="#10b981" strokeWidth="2" />
            ))}
            {currentLine && (
              <line x1={currentLine.x1} y1={currentLine.y1} x2={currentLine.x2} y2={currentLine.y2} stroke="#10b981" strokeWidth="2" strokeDasharray="4" />
            )}
          </svg>

          {/* Economic Data Overlay (HTML based for simplicity) */}
          {showEconData && chartData.map((d, i) => d.econEvent && (
            <div key={i} className="absolute top-4 bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap" style={{ left: `${(i / chartData.length) * 100}%`, transform: 'translateX(-50%)' }}>
              {d.econEvent}
            </div>
          ))}
        </div>

        {/* Volume Chart */}
        <div className="h-[15%] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip cursor={{fill: '#262626'}} contentStyle={{display: 'none'}} />
              <Bar dataKey="volume" fill="#525252" isAnimationActive={false}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isUp ? '#10b981' : '#ef4444'} opacity={0.5} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RSI Chart */}
        {showRSI && (
          <div className="h-[20%] w-full mt-4 border-t border-neutral-800 pt-4">
            <h3 className="absolute text-[10px] font-mono text-neutral-500">RSI (14)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="date" stroke="#525252" tick={{fontSize: 10}} />
                <YAxis domain={[0, 100]} stroke="#525252" tick={{fontSize: 10, fontFamily: 'monospace'}} orientation="right" ticks={[30, 50, 70]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
                  itemStyle={{ color: '#a855f7', fontFamily: 'monospace' }}
                />
                {/* Overbought/Oversold zones */}
                <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} />
                <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#10b981" strokeDasharray="3 3" opacity={0.5} />
                <Line type="monotone" dataKey="rsi" stroke="#a855f7" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
