import React from 'react';
import type { CalloutData } from '../../types/document';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface CalloutEditorProps {
  callout?: CalloutData;
  onChange: (callout: CalloutData) => void;
}

export const CalloutEditor: React.FC<CalloutEditorProps> = ({
  callout = { type: 'info', title: 'Note', text: '' },
  onChange
}) => {
  return (
    <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-800">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Callout Style</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'info', label: 'Info', icon: Info, color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
              { id: 'warning', label: 'Warning', icon: AlertTriangle, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
              { id: 'success', label: 'Success', icon: CheckCircle, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
              { id: 'tip', label: 'Tip', icon: AlertCircle, color: 'text-purple-400 border-purple-500/40 bg-purple-500/10' },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = callout.type === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onChange({ ...callout, type: t.id as any })}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                    isSelected ? t.color : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Callout Title (Optional)</label>
          <input
            type="text"
            value={callout.title || ''}
            onChange={(e) => onChange({ ...callout, title: e.target.value })}
            placeholder="e.g. 100% Reproducibility or Release Gate Approved"
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-300">Message / Content</label>
        <textarea
          value={callout.text}
          onChange={(e) => onChange({ ...callout, text: e.target.value })}
          placeholder="Callout text description..."
          rows={3}
          className="w-full p-3 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-y"
        />
      </div>
    </div>
  );
};
