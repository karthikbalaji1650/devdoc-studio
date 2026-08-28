import React, { useState, useEffect } from 'react';
import type { DocumentModel, DocSection, SectionType } from './types/document';
import { TEMPLATE_REGISTRY, getDefaultDocument } from './templates';
import { HeaderNav } from './components/HeaderNav';
import { DocumentSidebar } from './components/DocumentSidebar';
import { SectionEditorContainer } from './components/SectionEditorContainer';
import { MetadataEditor } from './components/editors/MetadataEditor';
import { DocumentPreview } from './components/DocumentPreview';
import { parseDocxFile } from './exporters/docxImporter';
import { saveAs } from 'file-saver';
import { 
  PanelLeftClose, 
  PanelLeftOpen, 
  CheckCircle 
} from 'lucide-react';

const STORAGE_KEY = 'devdoc_studio_current_doc_v1';

export const App: React.FC = () => {
  // Load saved state or default
  const [document, setDocument] = useState<DocumentModel>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved document', e);
      }
    }
    return getDefaultDocument();
  });

  const [activeSectionId, setActiveSectionId] = useState<string | 'metadata'>('metadata');
  const [viewMode, setViewMode] = useState<'paginated' | 'continuous'>('paginated');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'split' | 'editor-only' | 'preview-only'>('split');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(document));
  }, [document]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Section manipulation handlers
  const handleUpdateMetadata = (updates: Partial<DocumentModel['metadata']>) => {
    setDocument(prev => ({
      ...prev,
      metadata: { ...prev.metadata, ...updates }
    }));
  };

  const handleUpdateSection = (id: string, updates: Partial<DocSection>) => {
    setDocument(prev => ({
      ...prev,
      sections: prev.sections.map(s => (s.id === id ? { ...s, ...updates } : s))
    }));
  };

  const handleDeleteSection = (id: string) => {
    setDocument(prev => {
      const newSections = prev.sections.filter(s => s.id !== id);
      if (activeSectionId === id) {
        setActiveSectionId(newSections.length > 0 ? newSections[0].id : 'metadata');
      }
      return { ...prev, sections: newSections };
    });
    showToast('Section deleted');
  };

  const handleDuplicateSection = (id: string) => {
    setDocument(prev => {
      const index = prev.sections.findIndex(s => s.id === id);
      if (index === -1) return prev;
      const target = prev.sections[index];
      const duplicated: DocSection = {
        ...JSON.parse(JSON.stringify(target)),
        id: `sec-${Date.now()}`,
        title: `${target.title} (Copy)`
      };
      const newSections = [...prev.sections];
      newSections.splice(index + 1, 0, duplicated);
      setActiveSectionId(duplicated.id);
      return { ...prev, sections: newSections };
    });
    showToast('Section duplicated');
  };

  const handleMoveSection = (id: string, direction: 'up' | 'down') => {
    setDocument(prev => {
      const index = prev.sections.findIndex(s => s.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.sections.length - 1) return prev;

      const targetIdx = direction === 'up' ? index - 1 : index + 1;
      const newSections = [...prev.sections];
      const [removed] = newSections.splice(index, 1);
      newSections.splice(targetIdx, 0, removed);
      return { ...prev, sections: newSections };
    });
  };

  const handleReorderSections = (draggedId: string, targetId: string) => {
    setDocument(prev => {
      const draggedIndex = prev.sections.findIndex(section => section.id === draggedId);
      const targetIndex = prev.sections.findIndex(section => section.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) return prev;

      const newSections = [...prev.sections];
      const [draggedSection] = newSections.splice(draggedIndex, 1);
      newSections.splice(targetIndex, 0, draggedSection);
      return { ...prev, sections: newSections };
    });
  };

  const handleAddSection = (level: 1 | 2 | 3, type: SectionType, title: string = 'New Section') => {
    const newId = `sec-${Date.now()}`;
    const newSection: DocSection = {
      id: newId,
      title,
      level,
      type,
      content: type === 'richText' ? '' : undefined,
      tableData: type === 'table' ? { headers: ['Parameter', 'Value'], rows: [['', '']] } : undefined,
      codeSnippet: type === 'codeDiff' ? { filename: '', language: 'javascript', code: '', isDiff: false } : undefined,
      testCases: type === 'testCases' ? [] : undefined,
      verificationMatrix: type === 'verificationMatrix' ? [] : undefined,
      callout: type === 'callout' ? { type: 'info', title: 'Note', text: '' } : undefined
    };

    setDocument(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setActiveSectionId(newId);
    showToast(`Added ${title}`);
  };

  // Template Switching
  const handleLoadTemplate = (templateId: string, isBlank: boolean = false) => {
    const tmpl = TEMPLATE_REGISTRY.find(t => t.id === templateId) || TEMPLATE_REGISTRY[0];
    const newDoc = isBlank ? tmpl.getBlankDoc() : tmpl.getSampleDoc();
    setDocument(newDoc);
    setActiveSectionId('metadata');
    showToast(`Loaded ${tmpl.name}${isBlank ? ' (Blank)' : ''}`);
  };

  const handleResetSampleData = () => {
    const currentType = document.metadata.templateType;
    handleLoadTemplate(currentType, false);
  };

  // Import / Export JSON
  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(document, null, 2)], { type: 'application/json' });
    saveAs(blob, `${document.metadata.docNumber || 'document'}_draft.json`);
    showToast('Draft project saved as JSON');
  };

  const handleImportJson = async (file: File) => {
    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      if (imported.metadata && imported.sections) {
        setDocument(imported);
        setActiveSectionId('metadata');
        showToast('Draft project loaded successfully');
      } else {
        alert('Invalid document project JSON format');
      }
    } catch (e) {
      console.error('Failed to import JSON', e);
      alert('Error parsing JSON file');
    }
  };

  // Upload DOCX template
  const handleUploadDocx = async (file: File) => {
    try {
      showToast('Parsing uploaded Word template...');
      const importedDoc = await parseDocxFile(file);
      setDocument(importedDoc);
      setActiveSectionId('metadata');
      showToast(`Imported ${importedDoc.sections.length} sections from DOCX!`);
    } catch (e) {
      console.error('Failed to parse docx', e);
      alert('Could not parse Word document. Please ensure it is a valid .docx file.');
    }
  };

  const activeSection = document.sections.find(s => s.id === activeSectionId);
  const activeSectionIndex = document.sections.findIndex(s => s.id === activeSectionId);

  const showEditor = (activeTab as string) !== 'preview-only';
  const showPreview = (activeTab as string) !== 'editor-only';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-fade-in border border-blue-400/40">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <HeaderNav
        document={document}
        onUpdateMetadata={handleUpdateMetadata}
        onLoadTemplate={handleLoadTemplate}
        onUploadDocx={handleUploadDocx}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onReset={handleResetSampleData}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      {/* App Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Document Outline & Section Navigator */}
        {sidebarOpen && (
          <DocumentSidebar
            sections={document.sections}
            activeSectionId={activeSectionId}
            onSelectSection={setActiveSectionId}
            onAddSection={handleAddSection}
            onReorderSections={handleReorderSections}
          />
        )}

        {/* Workspace Central Split Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Section Form Editor Column */}
          {showEditor && (
            <div className="flex-1 flex flex-col h-[calc(100vh-57px)] border-r border-slate-800 bg-slate-950 overflow-hidden">
              {/* Editor Sub-Header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    title={sidebarOpen ? 'Collapse Outline' : 'Expand Outline'}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                  </button>
                  <span className="font-semibold text-slate-200">
                    {activeSectionId === 'metadata' ? 'Document Properties' : activeSection?.title || 'Section Editor'}
                  </span>
                </div>

                {/* View Split Switcher on Mobile/Tablet */}
                <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('split')}
                    className={`px-2 py-1 text-[11px] font-medium rounded ${
                      activeTab === 'split' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Split
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('editor-only')}
                    className={`px-2 py-1 text-[11px] font-medium rounded ${
                      activeTab === 'editor-only' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview-only')}
                    className={`px-2 py-1 text-[11px] font-medium rounded ${
                      activeTab === 'preview-only' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>

              {/* Editor Body Area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                {activeSectionId === 'metadata' ? (
                  <MetadataEditor
                    metadata={document.metadata}
                    onChange={handleUpdateMetadata}
                  />
                ) : activeSection ? (
                  <SectionEditorContainer
                    section={activeSection}
                    onUpdate={(updates) => handleUpdateSection(activeSection.id, updates)}
                    onDelete={() => handleDeleteSection(activeSection.id)}
                    onDuplicate={() => handleDuplicateSection(activeSection.id)}
                    onMoveUp={() => handleMoveSection(activeSection.id, 'up')}
                    onMoveDown={() => handleMoveSection(activeSection.id, 'down')}
                    isFirst={activeSectionIndex === 0}
                    isLast={activeSectionIndex === document.sections.length - 1}
                  />
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    <p className="text-sm">Select a section from the outline to begin editing.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* High-Fidelity Live Document Preview Column */}
          {showPreview && (
            <DocumentPreview
              document={document}
              viewMode={viewMode}
              onSelectSection={(id) => {
                setActiveSectionId(id);
                setActiveTab('split');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
