import React from 'react';
import type { DocSection, SectionType } from '../types/document';
import { RichTextEditor } from './editors/RichTextEditor';
import { TableEditor } from './editors/TableEditor';
import { CodeDiffEditor } from './editors/CodeDiffEditor';
import { TestCasesEditor } from './editors/TestCasesEditor';
import { VerificationMatrixEditor } from './editors/VerificationMatrixEditor';
import { CalloutEditor } from './editors/CalloutEditor';
import { 
  FileText, 
  Table, 
  Code, 
  CheckSquare, 
  ShieldCheck, 
  AlertCircle, 
  Trash2, 
  Copy, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';

interface SectionEditorContainerProps {
  section: DocSection;
  onUpdate: (updates: Partial<DocSection>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const SectionEditorContainer: React.FC<SectionEditorContainerProps> = ({
  section,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast
}) => {
  const sectionTypes: { id: SectionType; label: string; icon: any }[] = [
    { id: 'richText', label: 'Rich Text / Markdown', icon: FileText },
    { id: 'table', label: 'Data Table', icon: Table },
    { id: 'codeDiff', label: 'Code & Diff', icon: Code },
    { id: 'testCases', label: 'Test Case Matrix', icon: CheckSquare },
    { id: 'verificationMatrix', label: 'RCA vs Resolution', icon: ShieldCheck },
    { id: 'callout', label: 'Callout Alert', icon: AlertCircle }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl animate-fade-in space-y-4 p-5">
      {/* Top Header: Title, Level, Reorder, Delete */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          {/* Level Badge */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => onUpdate({ level: 1 })}
              className={`px-2 py-0.5 text-xs font-bold rounded ${
                section.level === 1 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => onUpdate({ level: 2 })}
              className={`px-2 py-0.5 text-xs font-bold rounded ${
                section.level === 2 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => onUpdate({ level: 3 })}
              className={`px-2 py-0.5 text-xs font-bold rounded ${
                section.level === 3 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              H3
            </button>
          </div>

          {/* Section Title Input */}
          <input
            type="text"
            value={section.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Section Heading Title..."
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-sm font-semibold text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Section Management Toolbar */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            title="Move Section Up"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:bg-slate-800 transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            title="Move Section Down"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:bg-slate-800 transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onDuplicate}
            title="Duplicate Section"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Delete Section"
            className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-900/50 text-rose-400 hover:bg-rose-900/60 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Type Selector */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
        <span className="text-[11px] font-semibold text-slate-500 px-2">Type:</span>
        {sectionTypes.map((st) => {
          const Icon = st.icon;
          const isActive = section.type === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onUpdate({ type: st.id })}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{st.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Specific Editor based on section type */}
      <div className="pt-2">
        {section.type === 'richText' && (
          <RichTextEditor
            value={section.content || ''}
            onChange={(content) => onUpdate({ content })}
          />
        )}

        {section.type === 'table' && (
          <TableEditor
            tableData={section.tableData}
            onChange={(tableData) => onUpdate({ tableData })}
          />
        )}

        {section.type === 'codeDiff' && (
          <CodeDiffEditor
            codeSnippet={section.codeSnippet}
            onChange={(codeSnippet) => onUpdate({ codeSnippet })}
          />
        )}

        {section.type === 'testCases' && (
          <TestCasesEditor
            testCases={section.testCases}
            onChange={(testCases) => onUpdate({ testCases })}
          />
        )}

        {section.type === 'verificationMatrix' && (
          <VerificationMatrixEditor
            matrix={section.verificationMatrix}
            onChange={(verificationMatrix) => onUpdate({ verificationMatrix })}
          />
        )}

        {section.type === 'callout' && (
          <CalloutEditor
            callout={section.callout}
            onChange={(callout) => onUpdate({ callout })}
          />
        )}
      </div>
    </div>
  );
};
