import React, { useRef } from 'react';
import { Bold, Italic, Code, List, ListOrdered, Quote, Minus, HelpCircle } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Type section content in Markdown or plain text...'
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selected = text.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    const newText = text.substring(0, start) + replacement + text.substring(end);
    onChange(newText);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
    }, 0);
  };

  const insertList = (numbered: boolean) => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const text = el.value;
    const prefix = numbered ? '1. ' : '- ';
    const newText = text.substring(0, start) + `\n${prefix}` + text.substring(start);
    onChange(newText);
  };

  return (
    <div className="border border-slate-700/80 rounded-xl overflow-hidden bg-slate-950 flex flex-col">
      {/* Markdown Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-slate-300">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => insertFormatting('**', '**')}
            title="Bold (**text**)"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('*', '*')}
            title="Italic (*text*)"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('`', '`')}
            title="Inline Code (`code`)"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <div className="h-4 w-[1px] bg-slate-800 mx-1" />
          <button
            type="button"
            onClick={() => insertList(false)}
            title="Bullet List (- item)"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertList(true)}
            title="Numbered List (1. item)"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('> ')}
            title="Quote (> quote)"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('\n---\n')}
            title="Divider Line (---)"
            className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <HelpCircle className="w-3 h-3" />
          <span>Markdown Supported</span>
        </div>
      </div>

      {/* Editor Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={8}
        className="w-full p-3 bg-transparent text-sm text-slate-100 placeholder-slate-600 focus:outline-none resize-y font-mono leading-relaxed"
      />
    </div>
  );
};
