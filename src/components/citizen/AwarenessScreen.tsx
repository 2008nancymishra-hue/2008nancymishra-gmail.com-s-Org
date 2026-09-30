import React, { useState } from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import { AwarenessArticle } from '../../types';
import {
  Search,
  BookOpen,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowRight,
  Lightbulb,
  Share2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const AwarenessScreen: React.FC = () => {
  const { articles } = useWasteManagement();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<AwarenessArticle | null>(null);

  const categories = [
    'All',
    'Wet Waste',
    'Dry Waste',
    'E-Waste',
    'Hazardous Waste',
    'Recycling',
  ];

  const filteredArticles = articles.filter((art) => {
    if (selectedCategory !== 'All' && art.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#F7F9F7] pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 pt-3 pb-2 border-b border-gray-200/80">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-base font-bold text-gray-900">Waste Awareness</h1>
            <p className="text-[11px] text-gray-500">
              Segregation guides & clean city masterclass
            </p>
          </div>
          <div className="flex items-center gap-1 bg-[#E8F5E9] text-[#2E7D32] px-2.5 py-1 rounded-full text-xs font-bold font-mono-numbers">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Eco Guide</span>
          </div>
        </div>

        {/* Live Search */}
        <div className="relative mb-2">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, plastic, e-waste, tips..."
            className="w-full pl-9 pr-3 py-2 bg-gray-100/90 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
          />
        </div>

        {/* Category Horizontal Scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-[#2E7D32] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Quick Color-coded Segregation Guide Bar */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-3.5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2.5">
            Municipal Bin Color Code Guide
          </span>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-lg">🥗</span>
              <p className="text-[11px] font-bold text-emerald-800 mt-1">Green Bin</p>
              <p className="text-[9px] text-emerald-600 font-medium">Wet Waste</p>
            </div>
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-lg">📦</span>
              <p className="text-[11px] font-bold text-blue-800 mt-1">Blue Bin</p>
              <p className="text-[9px] text-blue-600 font-medium">Dry Recyclable</p>
            </div>
            <div className="p-2 rounded-xl bg-purple-50 border border-purple-200">
              <span className="text-lg">💻</span>
              <p className="text-[11px] font-bold text-purple-800 mt-1">Purple Bin</p>
              <p className="text-[9px] text-purple-600 font-medium">E-Waste</p>
            </div>
            <div className="p-2 rounded-xl bg-red-50 border border-red-200">
              <span className="text-lg">⚠️</span>
              <p className="text-[11px] font-bold text-red-800 mt-1">Red Bin</p>
              <p className="text-[9px] text-red-600 font-medium">Hazardous</p>
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-3">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => setActiveArticle(art)}
              className="bg-white border border-gray-200/90 hover:border-[#2E7D32]/50 rounded-2xl p-4 shadow-sm cursor-pointer transition-all active:scale-[0.99] group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                  {art.category}
                </span>
                <span className="text-[10px] text-gray-400 font-mono-numbers">
                  {art.readTime}
                </span>
              </div>

              <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#2E7D32] transition-colors leading-snug">
                {art.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                {art.excerpt}
              </p>

              {/* Do & Don't snippet */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gray-500 flex items-center gap-1 font-medium">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Includes {art.dos.length} Do’s & {art.donts.length} Don’ts</span>
                </span>
                <span className="font-bold text-[#2E7D32] flex items-center gap-0.5 group-hover:underline">
                  <span>Read Guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-200">
            {/* Modal Drag Handle / Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">
                {activeArticle.category}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-3 space-y-4">
              <div>
                <h2 className="text-base font-bold text-gray-900 leading-snug">
                  {activeArticle.title}
                </h2>
                <p className="text-[11px] text-gray-500 mt-1 font-mono-numbers">
                  Published by Civic Sanitation Authority · {activeArticle.readTime}
                </p>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed bg-[#F7F9F7] p-3 rounded-xl border border-gray-200/80">
                {activeArticle.content}
              </p>

              {/* Do's */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Do’s</span>
                </span>
                <div className="space-y-1 pl-1">
                  {activeArticle.dos.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Don'ts */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>Don’ts</span>
                </span>
                <div className="space-y-1 pl-1">
                  {activeArticle.donts.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tips */}
              {activeArticle.tips && activeArticle.tips.length > 0 && (
                <div className="bg-amber-50 border border-amber-200/80 p-3 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Recycling Pro-Tip</span>
                  </span>
                  {activeArticle.tips.map((tip, idx) => (
                    <p key={idx} className="text-xs text-amber-800 leading-relaxed">
                      {tip}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveArticle(null)}
                className="w-full py-2.5 bg-[#2E7D32] text-white font-bold text-xs rounded-xl shadow-md"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
