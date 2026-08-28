import React, { useState } from 'react';
import type { DocSection, SectionType } from '../types/document';
import { 
  FileText, 
  Table, 
  Code, 
  CheckSquare, 
  ShieldCheck, 
  AlertCircle, 
  Plus, 
  Sliders, 
  Search, 
  Hash, 
  ChevronRight, 
  ListTree 
} from 'lucide-react';

interface DocumentSidebarProps {
  sections: DocSection[];
  activeSectionId: string | 'metadata';
  onSelectSection: (id: string | 'metadata') => void;
  onAddSection: (level: 1 | 2 | 3, type: SectionType, title?: string) => void;
}

export const DocumentSidebar: React.FC<DocumentSidebarProps> = ({
  sections,
  activeSectionId,
  onSelectSection,
  onAddSection
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const filteredSections = sections.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSectionIcon = (type: SectionType) => {
    switch (type) {
      case 'table': return Table;
      case 'codeDiff': return Code;
      case 'testCases': return CheckSquare;
      case 'verificationMatrix': return ShieldCheck;
      case 'callout': return AlertCircle;
      default: return FileText;
    }
  };

  return (
    <aside className="w-80 bg-slate-900/90 border-r border-slate-800 flex flex-col h-[calc(100vh-57px)] sticky top-[57px] shadow-xl select-none">
      {/* Sidebar Header */}
      <div className="p-3 border-b border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <ListTree className="w-4 h-4 text-blue-400" />
            <span>Document Outline</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            {sections.length} Sections
          </span>
        </div>

        {/* Search / Filter Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter sections..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Navigation Tree */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {/* Document Overview / Metadata Option */}
        <button
          type="button"
          onClick={() => onSelectSection('metadata')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all ${
            activeSectionId === 'metadata'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4 text-blue-400" />
          <span className="flex-1">Document Header & Metadata</span>
        </button>

        <div className="pt-2 pb-1 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Sections & Headings
        </div>

        {/* Section List */}
        {filteredSections.map((sec, idx) => {
          const Icon = getSectionIcon(sec.type);
          const isActive = activeSectionId === sec.id;
          const indent = sec.level === 1 ? 'pl-2' : sec.level === 2 ? 'pl-5' : 'pl-8';

          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => onSelectSection(sec.id)}
              className={`w-full flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-xs text-left transition-all ${indent} ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/30'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <span className={`text-[10px] font-mono opacity-60 ${isActive ? 'text-blue-200' : 'text-slate-500'}`}>
                {sec.level === 1 ? 'H1' : sec.level === 2 ? 'H2' : 'H3'}
              </span>
              <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-blue-400'}`} />
              <span className="flex-1 truncate">
                {sec.title || `Untitled Section ${idx + 1}`}
              </span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Bottom Add Section Button */}
      <div className="p-3 border-t border-slate-800 relative">
        <button
          type="button"
          onClick={() => setAddMenuOpen(!addMenuOpen)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Insert New Section</span>
        </button>

        {addMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-30" 
              onClick={() => setAddMenuOpen(false)} 
            />
            <div className="absolute bottom-16 left-3 right-3 rounded-xl glass-dropdown z-40 p-2 animate-fade-in space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Choose Section Type
              </div>
              <button
                type="button"
                onClick={() => {
                  onAddSection(1, 'richText', 'New Major Section');
                  setAddMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg text-left"
              >
                <Hash className="w-3.5 h-3.5 text-blue-400" />
                <span>Heading 1 (Major Section)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddSection(2, 'richText', 'New Subsection');
                  setAddMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg text-left"
              >
                <Hash className="w-3.5 h-3.5 text-indigo-400" />
                <span>Heading 2 (Subsection)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddSection(1, 'table', 'Data & Environment Table');
                  setAddMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg text-left"
              >
                <Table className="w-3.5 h-3.5 text-emerald-400" />
                <span>Data Table</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddSection(2, 'codeDiff', 'Code Changes');
                  setAddMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg text-left"
              >
                <Code className="w-3.5 h-3.5 text-purple-400" />
                <span>Code Block & Diff</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddSection(1, 'testCases', 'Validation & Test Cases');
                  setAddMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg text-left"
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Test Case Matrix</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddSection(1, 'verificationMatrix', 'RCA vs Resolution Matrix');
                  setAddMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg text-left"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>RCA vs Resolution Matrix</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddSection(2, 'callout', 'Key Observation');
                  setAddMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg text-left"
              >
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Callout Alert Box</span>
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
