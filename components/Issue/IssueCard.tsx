
import React from 'react';
import { ThumbsUp, MessageSquare, MapPin, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { Issue } from '../../types';

interface IssueCardProps {
  issue: Issue;
  onUpvote: (id: string) => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onUpvote }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Resolved': return 'bg-green-50 text-green-700 border-green-100';
      case 'Emergency': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="shadcn-card hover:border-slate-300 transition-all flex flex-col group">
      {/* Ticket Header */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-tight ${getStatusConfig(issue.status)}`}>
            {issue.status}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{issue.category}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Calendar size={12} />
          <span className="text-[10px] font-bold uppercase">{new Date(issue.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-gov-blue transition-colors">
            {issue.title}
          </h3>
          {issue.priority === 'Emergency' && (
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
          )}
        </div>
        
        <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-3">
          {issue.description}
        </p>

        <div className="flex items-center gap-1.5 text-slate-400 mb-2">
          <MapPin size={12} />
          <span className="text-[11px] font-medium uppercase truncate">{issue.location.village}, {issue.location.district}</span>
        </div>

        {issue.status === 'Resolved' && (
          <div className="mt-4 p-2 bg-green-50 rounded border border-green-100 flex items-center gap-2">
            <ShieldCheck size={14} className="text-green-600" />
            <span className="text-[10px] font-bold text-green-700 uppercase tracking-tight">Resolution Verified by Nodal Officer</span>
          </div>
        )}
      </div>

      {/* Interactions Footer */}
      <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onUpvote(issue.id)}
            className="flex items-center gap-2 text-slate-400 hover:text-gov-blue transition-colors"
          >
            <ThumbsUp size={16} />
            <span className="text-xs font-bold">{issue.reactions}</span>
          </button>
          <button className="flex items-center gap-2 text-slate-400 hover:text-gov-blue transition-colors">
            <MessageSquare size={16} />
            <span className="text-xs font-bold">{issue.comments}</span>
          </button>
        </div>
        <button className="text-[11px] font-bold text-gov-blue flex items-center gap-1 uppercase tracking-tight hover:underline">
          Track Details <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default IssueCard;
