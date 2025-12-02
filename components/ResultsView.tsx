import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { ExternalLink, MessageSquareText, TrendingUp, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ScrapeResult } from '../types';

interface ResultsViewProps {
  result: ScrapeResult | null;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <h3 className="text-slate-400 text-sm font-medium">Keywords Found</h3>
          </div>
          <p className="text-2xl font-bold text-white">{result.stats.length}</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="text-slate-400 text-sm font-medium">Top Keyword</h3>
          </div>
          <p className="text-2xl font-bold text-white truncate">
            {result.stats.length > 0 
              ? result.stats.reduce((prev, current) => (prev.count > current.count) ? prev : current).keyword
              : 'N/A'}
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <ExternalLink className="h-5 w-5" />
            </div>
            <h3 className="text-slate-400 text-sm font-medium">Sources Scanned</h3>
          </div>
          <p className="text-2xl font-bold text-white">{result.sources.length}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-6">Keyword Frequency</h3>
          {result.stats.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.stats} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis 
                    dataKey="keyword" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    cursor={{ fill: '#334155', opacity: 0.4 }}
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderColor: '#475569', 
                      color: '#f1f5f9',
                      borderRadius: '0.5rem'
                    }}
                    itemStyle={{ color: '#fb923c' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {result.stats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#f97316" fillOpacity={0.8 + (index * 0.05)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] w-full flex flex-col items-center justify-center text-slate-500 gap-2">
              <AlertCircle className="h-8 w-8 opacity-50" />
              <p>No statistical data extracted from analysis.</p>
            </div>
          )}
        </div>

        {/* Sources List */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Source Threads</h3>
          <div className="flex-1 overflow-y-auto max-h-[300px] space-y-3 custom-scrollbar">
             {result.sources.length > 0 ? (
               result.sources.map((source, i) => (
                 <a 
                  key={i} 
                  href={source.web?.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-800 transition-all group"
                 >
                   <div className="flex items-start justify-between gap-2">
                      <span className="text-sm text-slate-300 font-medium group-hover:text-orange-400 transition-colors line-clamp-2">
                        {source.web?.title || 'Untitled Source'}
                      </span>
                      <ExternalLink className="h-4 w-4 text-slate-600 group-hover:text-orange-500 flex-shrink-0 mt-0.5" />
                   </div>
                   <span className="text-xs text-slate-500 mt-1 block truncate">
                     {source.web?.uri}
                   </span>
                 </a>
               ))
             ) : (
               <div className="text-slate-500 text-sm text-center py-10">
                 No direct sources linked.
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2">Analysis Report</h3>
        <div className="prose prose-invert prose-sm max-w-none text-slate-300">
          <ReactMarkdown>{result.summary}</ReactMarkdown>
        </div>
      </div>

    </div>
  );
};

export default ResultsView;
