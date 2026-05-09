import React, { useState } from 'react';
import { FlaskConical, Play, CheckCircle2, AlertCircle, Loader2, Sparkles, Image as ImageIcon, Wand2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { deepStrategyAnalysis, analyzeChartImage, editChartImage } from '../services/gemini';
import { cn } from '../lib/utils';

export const StrategyLab: React.FC = () => {
  const [strategy, setStrategy] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState('');
  const [isImageAnalyzing, setIsImageAnalyzing] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleAnalyze = async () => {
    if (!strategy.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const result = await deepStrategyAnalysis(strategy);
      setAnalysis(result || 'Analysis failed.');
    } catch (error) {
      console.error(error);
      setAnalysis('Error analyzing strategy.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!image || isImageAnalyzing) return;
    setIsImageAnalyzing(true);
    try {
      const result = await analyzeChartImage(image, "Analyze this trading chart. Identify support/resistance, trends, and potential entry points.");
      setImageAnalysis(result || 'Analysis failed.');
    } catch (error) {
      console.error(error);
      setImageAnalysis('Error analyzing image.');
    } finally {
      setIsImageAnalyzing(false);
    }
  };

  const handleEditImage = async () => {
    if (!image || !editPrompt || isEditing) return;
    setIsEditing(true);
    try {
      const result = await editChartImage(image, editPrompt);
      if (result) setImage(result);
      setEditPrompt('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Strategy Builder */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-mono uppercase tracking-widest">Strategy Lab</h2>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            RUN DEEP ANALYSIS
          </button>
        </div>

        <textarea
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
          placeholder="Describe your strategy (e.g., 'Buy when RSI < 30 and price hits 200 EMA on 4H chart...')"
          className="flex-1 min-h-[200px] bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-sm font-mono focus:outline-none focus:border-emerald-500 transition-colors resize-none"
        />

        {analysis && (
          <div className="mt-4 p-4 bg-neutral-950 border border-neutral-800 rounded-lg overflow-y-auto max-h-[300px]">
            <div className="flex items-center gap-2 mb-2 text-xs font-mono text-emerald-500">
              <Sparkles className="w-3 h-3" />
              AI INSIGHTS (THINKING MODE)
            </div>
            <div className="markdown-body text-sm text-neutral-400">
              <Markdown>{analysis}</Markdown>
            </div>
          </div>
        )}
      </div>

      {/* Chart Vision */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-mono uppercase tracking-widest">Chart Vision</h2>
        </div>

        <div className="relative aspect-video bg-neutral-800 rounded-lg border-2 border-dashed border-neutral-700 flex items-center justify-center overflow-hidden group">
          {image ? (
            <>
              <img src={image} alt="Chart" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <label className="cursor-pointer bg-white text-black px-3 py-1.5 rounded text-xs font-bold hover:bg-neutral-200">
                  REPLACE
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                <button 
                  onClick={handleAnalyzeImage}
                  disabled={isImageAnalyzing}
                  className="bg-emerald-500 text-black px-3 py-1.5 rounded text-xs font-bold hover:bg-emerald-600 disabled:opacity-50"
                >
                  {isImageAnalyzing ? 'ANALYZING...' : 'ANALYZE'}
                </button>
              </div>
            </>
          ) : (
            <label className="cursor-pointer flex flex-col items-center gap-2 text-neutral-500 hover:text-neutral-400 transition-colors">
              <ImageIcon className="w-8 h-8" />
              <span className="text-xs font-mono">UPLOAD CHART SCREENSHOT</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          )}
        </div>

        {image && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="Edit image (e.g., 'Add a retro filter', 'Highlight trend')"
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleEditImage}
                disabled={isEditing || !editPrompt}
                className="bg-neutral-800 border border-neutral-700 hover:border-emerald-500 p-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isEditing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {imageAnalysis && (
          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg overflow-y-auto max-h-[200px]">
            <div className="text-xs font-mono text-emerald-500 mb-2">CHART ANALYSIS</div>
            <div className="markdown-body text-sm text-neutral-400">
              <Markdown>{imageAnalysis}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
