import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { DocumentModel } from '../types/document';
import { FileText, Lock, Plus, Share2, Trash2, Eye } from 'lucide-react';

interface UserDocument {
  id: string;
  title: string;
  ownerEmail: string;
  lastModified: string;
  status: string;
}

export const DocumentsDashboard: React.FC<{
  onNewDocument: () => void;
  onOpenDocument: (docId: string) => void;
}> = ({ onNewDocument, onOpenDocument }) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<UserDocument[]>([]);

  useEffect(() => {
    // Load documents from localStorage
    const allDocs = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('devdoc_doc_')) {
        try {
          const doc = JSON.parse(localStorage.getItem(key) || '{}') as DocumentModel;
          if (!user || user.role === 'admin' || user.id === doc.metadata.ownerId) {
            allDocs.push({
              id: key.replace('devdoc_doc_', ''),
              title: doc.metadata.title,
              ownerEmail: doc.metadata.ownerEmail,
              lastModified: doc.metadata.lastModifiedAt || doc.metadata.date,
              status: doc.metadata.status,
            });
          }
        } catch (e) {
          console.error('Failed to parse document', e);
        }
      }
    }
    setDocuments(allDocs);
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Documents</h1>
          <p className="text-slate-400">
            {user?.role === 'admin' ? 'Manage all team documents' : 'View and edit your documents'}
          </p>
        </div>

        {/* New Document Button */}
        <button
          onClick={onNewDocument}
          className="mb-8 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New Document
        </button>

        {/* Documents Grid */}
        {documents.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No documents yet</p>
            <p className="text-slate-500 text-sm mt-1">Create your first document to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onOpenDocument(doc.id)}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <FileText className="w-8 h-8 text-blue-400 flex-shrink-0" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded bg-slate-800 text-slate-300">
                    {doc.status}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-1 line-clamp-2">{doc.title}</h3>
                <p className="text-xs text-slate-400 mb-3">
                  {doc.ownerEmail === user?.email ? 'Your document' : `By ${doc.ownerEmail}`}
                </p>
                <p className="text-xs text-slate-500">
                  Modified: {new Date(doc.lastModified).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
