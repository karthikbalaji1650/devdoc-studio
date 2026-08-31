import React, { useEffect, useState, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Copy, 
  Printer, 
  Upload, 
  FolderDown, 
  FolderUp, 
  Sparkles, 
  RotateCcw, 
  Check, 
  ChevronDown,
  Layers,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { DocumentModel } from '../types/document';
import { TEMPLATE_REGISTRY } from '../templates';
import { exportToDocx } from '../exporters/docxExporter';
import { copyToGoogleDocsClipboard } from '../exporters/googleDocsExporter';
import { useAuth } from '../context/AuthContext';

interface HeaderNavProps {
  document: DocumentModel;
  onUpdateMetadata: (updates: Partial<DocumentModel['metadata']>) => void;
  onLoadTemplate: (templateId: string, isBlank?: boolean) => void;
  onUploadDocx: (file: File) => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onReset: () => void;
  viewMode: 'paginated' | 'continuous';
  onToggleViewMode: (mode: 'paginated' | 'continuous') => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  document,
  onLoadTemplate,
  onUploadDocx,
  onExportJson,
  onImportJson,
  onReset,
  viewMode,
  onToggleViewMode
}) => {
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const templateDropdownRef = useRef<HTMLDivElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTemplateDropdownOpen(false);
        setExportDropdownOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (!templateDropdownOpen && !exportDropdownOpen) return;

    const handleOutsidePointer = (event: PointerEvent) => {
      const target = event.target as Node;
      const clickedInsideTemplate = templateDropdownRef.current?.contains(target);
      const clickedInsideExport = exportDropdownRef.current?.contains(target);

      if (!clickedInsideTemplate && !clickedInsideExport) {
        setTemplateDropdownOpen(false);
        setExportDropdownOpen(false);
      }
    };

    window.addEventListener('pointerdown', handleOutsidePointer);
    return () => window.removeEventListener('pointerdown', handleOutsidePointer);
  }, [templateDropdownOpen, exportDropdownOpen]);

  const handleDocxExport = async () => {
    try {
      setIsExportingDocx(true);
      await exportToDocx(document);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.1 }
      });
    } catch (err) {
      console.error('Failed to export DOCX:', err);
      alert('Error generating DOCX document. Please verify all sections.');
    } finally {
      setIsExportingDocx(false);
      setExportDropdownOpen(false);
    }
  };

  const handleGoogleDocsCopy = async () => {
    try {
      const success = await copyToGoogleDocsClipboard(document);
      if (success) {
        setCopiedSuccess(true);
        confetti({
          particleCount: 50,
          spread: 40,
          origin: { y: 0.1 }
        });
        setTimeout(() => setCopiedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to copy to Google Docs clipboard:', err);
    } finally {
      setExportDropdownOpen(false);
    }
  };

  const handlePrint = () => {
    window.print();
    setExportDropdownOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadDocx(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJson(file);
    }
    if (e.target) e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shadow-lg">
      {/* Brand & Document Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                DocCraft Studio
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Dev Edition
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Word & Docs Generator for Engineers
            </p>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-slate-800 mx-1" />

        {/* Template Switcher Dropdown */}
        <div ref={templateDropdownRef} className="relative z-50">
          <button
            onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs font-medium text-slate-200 border border-slate-700/60 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Template: <strong className="text-white">{document.metadata.templateType.replace('-', ' ').toUpperCase()}</strong>
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {templateDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setTemplateDropdownOpen(false)} 
              />
              <div className="absolute left-0 mt-2 w-80 rounded-xl glass-dropdown z-50 p-2 animate-fade-in divide-y divide-slate-800">
                <div className="p-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Pre-built Engineering Templates
                  </div>
                  <div className="space-y-1">
                    {TEMPLATE_REGISTRY.map((tmpl) => (
                      <div
                        key={tmpl.id}
                        className="group flex flex-col p-2 rounded-lg hover:bg-slate-800/80 cursor-pointer transition-all"
                        onClick={() => {
                          onLoadTemplate(tmpl.id, false);
                          setTemplateDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-medium text-xs text-slate-200 group-hover:text-blue-400">
                            {tmpl.category === 'technical-analysis' && <FileCode2 className="w-4 h-4 text-blue-400" />}
                            {tmpl.category === 'test-report' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            {tmpl.category === 'adr' && <Layers className="w-4 h-4 text-purple-400" />}
                            {tmpl.category === 'rca' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                            <span>{tmpl.name}</span>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-300">
                            {tmpl.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                          {tmpl.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-2 pt-2 flex items-center justify-between">
                  <button
                    onClick={() => {
                      onLoadTemplate(document.metadata.templateType, true);
                      setTemplateDropdownOpen(false);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
                  >
                    Start with Blank Template
                  </button>
                  <button
                    onClick={() => {
                      onReset();
                      setTemplateDropdownOpen(false);
                    }}
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 px-2 py-1 rounded hover:bg-blue-500/10 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restore Sample Data</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Center: View Mode Switcher */}
      <div className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
        <button
          onClick={() => onToggleViewMode('paginated')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
            viewMode === 'paginated'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Page View (8.5x11)
        </button>
        <button
          onClick={() => onToggleViewMode('continuous')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
            viewMode === 'continuous'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Continuous Flow
        </button>
      </div>

      {/* Right: Export & Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".docx"
          className="hidden"
        />
        <input
          type="file"
          ref={jsonInputRef}
          onChange={handleJsonChange}
          accept=".json"
          className="hidden"
        />

        {/* Upload DOCX Template */}
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Upload existing Word .docx template or document to extract sections"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors"
        >
          <Upload className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Import DOCX</span>
        </button>

        {/* Copy for Google Docs button */}
        <button
          onClick={handleGoogleDocsCopy}
          title="Copy formatted document directly to clipboard for instant pasting into Google Docs (Ctrl+V / Cmd+V)"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 rounded-lg transition-all shadow-sm shadow-emerald-950/50"
        >
          {copiedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>Copied for Docs!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Copy for Google Docs</span>
            </>
          )}
        </button>

        {/* Primary Export to Word .docx */}
        <button
          onClick={handleDocxExport}
          disabled={isExportingDocx}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold btn-primary rounded-lg"
        >
          <Download className="w-4 h-4" />
          <span>{isExportingDocx ? 'Generating...' : 'Export Word (.docx)'}</span>
        </button>

        {/* Secondary Actions Dropdown (JSON & Print) */}
        <div ref={exportDropdownRef} className="relative">
          <button
            onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {exportDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setExportDropdownOpen(false)} 
              />
              <div className="absolute right-0 mt-2 w-52 rounded-xl glass-dropdown z-50 p-1.5 animate-fade-in space-y-1">
                <button
                  onClick={handlePrint}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => {
                    onExportJson();
                    setExportDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <FolderDown className="w-4 h-4 text-blue-400" />
                  <span>Save Draft Project (JSON)</span>
                </button>
                <button
                  onClick={() => {
                    jsonInputRef.current?.click();
                    setExportDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <FolderUp className="w-4 h-4 text-amber-400" />
                  <span>Load Draft Project (JSON)</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* User Profile & Logout Button */}
        <UserProfileButton />
      </div>
    </header>
  );
};

const UserProfileButton: React.FC = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative group">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs font-medium text-slate-200 border border-slate-700/60 transition-colors"
      >
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <User className="w-3 h-3 text-white" />
        </div>
        <span className="hidden sm:inline">{user.username}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isDropdownOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsDropdownOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-48 rounded-xl glass-dropdown z-50 p-2 animate-fade-in space-y-2">
            <div className="px-3 py-2 border-b border-slate-700">
              <p className="text-xs text-slate-400">Logged in as</p>
              <p className="text-sm font-semibold text-white">{user.email}</p>
              <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wide">
                {user.role === 'admin' ? '👑 Administrator' : '👤 User'}
              </p>
            </div>
            <button
              onClick={() => {
                logout();
                setIsDropdownOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-left text-red-400 hover:text-red-300"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
