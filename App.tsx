import React, { useState } from 'react';
import { Radio } from 'lucide-react';
import ScraperForm from './components/ScraperForm';
import ResultsView from './components/ResultsView';
import { analyzeRedditKeywords } from './services/geminiService';
import { ScrapeRequest, ScrapeResult } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (request: ScrapeRequest) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeRedditKeywords(request.topic, request.keywords);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black text-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-orange-500/10 rounded-2xl mb-4 ring-1 ring-orange-500/20">
            <Radio className="h-8 w-8 text-orange-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Reddit <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Pulse</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Analyze keyword frequency and sentiment across Reddit discussions using AI-powered search grounding.
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          
          <div className="max-w-2xl mx-auto">
            <ScraperForm onSearch={handleSearch} isLoading={loading} />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center max-w-2xl mx-auto animate-in fade-in slide-in-from-top-2">
              <p className="font-medium">Analysis Failed</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          )}

          <div className="min-h-[400px]">
            <ResultsView result={result} />
          </div>

        </main>

        <footer className="mt-20 text-center text-slate-600 text-sm border-t border-slate-800 pt-8">
          <p>Powered by Google Gemini 2.5 Flash & Search Grounding</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
