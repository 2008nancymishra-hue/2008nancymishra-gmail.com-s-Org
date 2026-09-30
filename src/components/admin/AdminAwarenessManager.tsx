import React, { useState } from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import { AwarenessArticle } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Search,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';

export const AdminAwarenessManager: React.FC = () => {
  const { articles, addArticle, updateArticle, deleteArticle } = useWasteManagement();

  const [search, setSearch] = useState('');
  const [editingArticle, setEditingArticle] = useState<AwarenessArticle | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [formState, setFormState] = useState<{
    title: string;
    category: AwarenessArticle['category'];
    readTime: string;
    excerpt: string;
    content: string;
    dos: string;
    donts: string;
    tips: string;
  }>({
    title: '',
    category: 'Wet Waste',
    readTime: '3 min read',
    excerpt: '',
    content: '',
    dos: '',
    donts: '',
    tips: '',
  });

  const categories: AwarenessArticle['category'][] = [
    'Wet Waste',
    'Dry Waste',
    'E-Waste',
    'Hazardous Waste',
    'Recycling',
  ];

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateModal = () => {
    setFormState({
      title: '',
      category: 'Wet Waste',
      readTime: '3 min read',
      excerpt: '',
      content: '',
      dos: 'Rinse food trays before disposal\nKeep wet and dry bins separate',
      donts: 'Never mix batteries into general waste\nDo not burn plastics',
      tips: 'Composting organic peels creates rich soil nutrient for home plants.',
    });
    setEditingArticle(null);
    setIsCreating(true);
  };

  const openEditModal = (art: AwarenessArticle) => {
    setFormState({
      title: art.title,
      category: art.category,
      readTime: art.readTime,
      excerpt: art.excerpt,
      content: art.content,
      dos: art.dos.join('\n'),
      donts: art.donts.join('\n'),
      tips: art.tips.join('\n'),
    });
    setEditingArticle(art);
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const dosList = formState.dos.split('\n').filter((d) => d.trim().length > 0);
    const dontsList = formState.donts.split('\n').filter((d) => d.trim().length > 0);
    const tipsList = formState.tips.split('\n').filter((t) => t.trim().length > 0);

    if (editingArticle) {
      updateArticle(editingArticle.id, {
        title: formState.title,
        category: formState.category,
        readTime: formState.readTime,
        excerpt: formState.excerpt,
        content: formState.content,
        dos: dosList,
        donts: dontsList,
        tips: tipsList,
      });
    } else {
      addArticle({
        title: formState.title,
        category: formState.category,
        readTime: formState.readTime,
        excerpt: formState.excerpt,
        content: formState.content,
        dos: dosList,
        donts: dontsList,
        tips: tipsList,
      });
    }

    setIsCreating(false);
    setEditingArticle(null);
  };

  return (
    <div className="bg-white border border-gray-200/90 rounded-2xl shadow-sm overflow-hidden p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Citizen Waste Awareness & Curriculum
          </h2>
          <p className="text-xs text-gray-500">
            Publish and manage segregation guidelines, circular economy manuals, and recycling tips.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="px-3 py-1.5 bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Article</span>
          </button>
        </div>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((art) => (
          <div
            key={art.id}
            className="border border-gray-200 rounded-2xl p-4 flex flex-col justify-between hover:border-[#2E7D32]/50 hover:shadow-xs transition-all space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                  {art.category}
                </span>
                <span className="text-[10px] text-gray-400 font-mono-numbers">
                  {art.readTime}
                </span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 leading-snug">{art.title}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                {art.excerpt}
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-gray-500">
                {art.dos.length} Do's · {art.donts.length} Don'ts
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(art)}
                  className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                  title="Edit Article"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteArticle(art.id)}
                  className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                  title="Delete Article"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-white w-full max-w-lg rounded-3xl p-5 shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">
                {editingArticle ? 'Edit Awareness Article' : 'Publish New Waste Guide'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formState.title}
                onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                placeholder="e.g. Master Segregation: Safe E-Waste Dropoffs"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#2E7D32]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formState.category}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      category: e.target.value as AwarenessArticle['category'],
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#2E7D32]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Estimated Read Time
                </label>
                <input
                  type="text"
                  value={formState.readTime}
                  onChange={(e) => setFormState({ ...formState, readTime: e.target.value })}
                  placeholder="3 min read"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Short Excerpt
              </label>
              <input
                type="text"
                value={formState.excerpt}
                onChange={(e) => setFormState({ ...formState, excerpt: e.target.value })}
                placeholder="1-line summary displayed on card preview..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#2E7D32]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Main Educational Body
              </label>
              <textarea
                rows={3}
                value={formState.content}
                onChange={(e) => setFormState({ ...formState, content: e.target.value })}
                placeholder="In-depth explanation..."
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#2E7D32] resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-emerald-800 mb-1">
                  Do's (one item per line)
                </label>
                <textarea
                  rows={3}
                  value={formState.dos}
                  onChange={(e) => setFormState({ ...formState, dos: e.target.value })}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#2E7D32] resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-red-800 mb-1">
                  Don'ts (one item per line)
                </label>
                <textarea
                  rows={3}
                  value={formState.donts}
                  onChange={(e) => setFormState({ ...formState, donts: e.target.value })}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#2E7D32] resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-amber-800 mb-1">
                Pro-Tips (one per line)
              </label>
              <textarea
                rows={2}
                value={formState.tips}
                onChange={(e) => setFormState({ ...formState, tips: e.target.value })}
                placeholder="Special municipal rewards or segregation hacks..."
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#2E7D32] resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#2E7D32] hover:bg-[#256629] text-white rounded-xl text-xs font-bold shadow-md"
              >
                {editingArticle ? 'Save Changes' : 'Publish Article'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
