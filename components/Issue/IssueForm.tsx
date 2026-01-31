
import React, { useState } from 'react';
import { Camera, X, Send, AlertTriangle } from 'lucide-react';
import { CATEGORIES } from '../../constants';
import { IssueCategory } from '../../types';

interface IssueFormProps {
  onSubmit: (issueData: any) => void;
  onClose: () => void;
}

const IssueForm: React.FC<IssueFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Roads' as IssueCategory,
    priority: 'Medium',
    isAnonymous: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-[#003366] p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Report an Issue</h2>
            <p className="text-blue-200 text-xs">Help improve your local community</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Issue Title</label>
            <input
              type="text"
              className="w-full shadcn-input outline-none"
              placeholder="e.g., Pothole near Village School"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
              <select
                className="w-full shadcn-input outline-none"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as IssueCategory })}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-white text-slate-900">{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Priority</label>
              <select
                className="w-full shadcn-input outline-none"
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Low" className="bg-white text-slate-900">Low</option>
                <option value="Medium" className="bg-white text-slate-900">Medium</option>
                <option value="High" className="bg-white text-slate-900">High</option>
                <option value="Emergency" className="bg-white text-slate-900">🚨 Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              className="w-full shadcn-input outline-none min-h-[120px]"
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 hover:border-blue-400 transition-colors cursor-pointer group">
            <div className="p-3 bg-white rounded-lg shadow-sm group-hover:bg-blue-50 transition-colors">
              <Camera size={24} className="text-slate-400 group-hover:text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Attach Photos/Videos</p>
              <p className="text-xs text-slate-400">Add visual proof to help resolve it faster</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-blue-600"
                checked={formData.isAnonymous}
                onChange={e => setFormData({ ...formData, isAnonymous: e.target.checked })}
              />
              <span className="text-sm text-slate-600">Post anonymously</span>
            </label>

            <button
              type="submit"
              className="px-6 py-2 bg-[#003366] text-white rounded-lg font-bold flex items-center gap-2 hover:bg-blue-900 transition-colors shadow-lg active:scale-95"
            >
              <Send size={18} />
              Submit Report
            </button>
          </div>

          {formData.priority === 'Emergency' && (
            <div className="flex items-start gap-3 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 mt-2">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <p className="text-[11px] font-medium uppercase tracking-tight">
                Warning: Emergency reports are routed directly to quick-response teams. Abuse of this tag may lead to penalties.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default IssueForm;
