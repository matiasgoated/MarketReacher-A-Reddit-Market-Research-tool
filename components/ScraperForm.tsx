import React, { useState } from 'react';
import { Search, Plus, X, Tag } from 'lucide-react';
import { ScrapeRequest } from '../types';

interface ScraperFormProps {
  onSearch: (request: ScrapeRequest) => void;
  isLoading: boolean;
}

const ScraperForm: React.FC<ScraperFormProps> = ({ onSearch, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);

  const handleAddKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    setKeywords(keywords.filter(k => k !== kwToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic && keywords.length > 0) {
      onSearch({ topic, keywords });
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-xl backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-slate-400 mb-2">
            Reddit Topic / Subreddit
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., r/reactjs, 'Best gaming laptops 2024'"
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Target Keywords to Track
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add keyword (Press Enter)"
              className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              disabled={!currentKeyword.trim()}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
            {keywords.length === 0 && (
              <span className="text-slate-600 text-sm italic py-1">No keywords added yet...</span>
            )}
            {keywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-sm animate-in fade-in zoom-in duration-200"
              >
                <Tag className="h-3 w-3" />
                {kw}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(kw)}
                  className="hover:text-white transition-colors ml-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !topic || keywords.length === 0}
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-orange-900/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Reddit Data...
            </>
          ) : (
            'Start Analysis'
          )}
        </button>
      </form>
    </div>
  );
};

export default ScraperForm;
