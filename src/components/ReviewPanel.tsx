import React, { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Clock, X, ChevronDown } from 'lucide-react';
import type { ReviewRequest, DocumentModel } from '../types/document';
import type { User } from '../types/auth';
import { useAuth } from '../context/AuthContext';

interface ReviewPanelProps {
  document: DocumentModel;
  onRequestReview: (reviewerEmail: string) => void;
  onUpdateReview: (reviewId: string, status: 'APPROVED' | 'NEEDS_CHANGES' | 'REJECTED', comments: string) => void;
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({
  document,
  onRequestReview,
  onUpdateReview
}) => {
  const { user, getAllUsers } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allUsers = getAllUsers();
  const reviews = document.metadata.reviews || [];
  const currentUser = user;

  // Get available reviewers (all users except the owner)
  const availableReviewers = allUsers.filter(u => u.email !== document.metadata.ownerEmail);

  // Get already requested reviewers
  const requestedReviewerEmails = reviews.map(r => r.reviewerEmail);
  const pendingReviewers = availableReviewers.filter(u => !requestedReviewerEmails.includes(u.email));

  const handleRequestReview = () => {
    if (selectedReviewer) {
      onRequestReview(selectedReviewer.email);
      setSelectedReviewer(null);
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: PointerEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener('pointerdown', handleClickOutside);
    return () => window.removeEventListener('pointerdown', handleClickOutside);
  }, [dropdownOpen]);

  const getReviewStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-emerald-400';
      case 'PENDING': return 'text-amber-400';
      case 'NEEDS_CHANGES': return 'text-orange-400';
      case 'REJECTED': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getReviewStatusBgColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-950';
      case 'PENDING': return 'bg-amber-950';
      case 'NEEDS_CHANGES': return 'bg-orange-950';
      case 'REJECTED': return 'bg-red-950';
      default: return 'bg-slate-800';
    }
  };

  const isOwner = currentUser?.email === document.metadata.ownerEmail;

  return (
    <div className="flex flex-col h-full bg-slate-950/80 border-l border-slate-800">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-4 py-3 z-40">
        <h3 className="text-sm font-semibold text-slate-200">Review Requests</h3>
        <p className="text-xs text-slate-400 mt-1">
          {reviews.length} review{reviews.length !== 1 ? 's' : ''} requested
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Request New Review (Owner Only) */}
        {isOwner && (
          <div className="p-4 border-b border-slate-800">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Request a Reviewer</label>
              
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full px-3 py-2 text-xs bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-between text-slate-300"
                >
                  <span>{selectedReviewer ? selectedReviewer.email : 'Select reviewer...'}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg z-40 max-h-48 overflow-y-auto">
                      {pendingReviewers.length > 0 ? (
                        pendingReviewers.map((reviewer) => (
                          <button
                            key={reviewer.id}
                            onClick={() => {
                              setSelectedReviewer(reviewer);
                              setDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 text-xs text-left text-slate-300 hover:bg-slate-700 border-b border-slate-700/50 last:border-0"
                          >
                            {reviewer.email}
                            <span className="text-slate-500 block text-[10px] mt-0.5">@{reviewer.username}</span>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-xs text-slate-500">
                          All available users already have review requests
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={handleRequestReview}
                disabled={!selectedReviewer}
                className="w-full px-3 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3 h-3" />
                Send Request
              </button>
            </div>
          </div>
        )}

        {/* Review List */}
        {reviews.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-200">{review.reviewerEmail}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Requested {new Date(review.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 ${getReviewStatusColor(review.status)} ${getReviewStatusBgColor(review.status)}`}>
                    {review.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                    {review.status === 'PENDING' && <Clock className="w-3 h-3" />}
                    {review.status === 'NEEDS_CHANGES' && <AlertCircle className="w-3 h-3" />}
                    {review.status === 'REJECTED' && <X className="w-3 h-3" />}
                    {review.status}
                  </span>
                </div>

                {review.comments && (
                  <div className="bg-slate-800/50 rounded px-2 py-1.5">
                    <p className="text-[11px] text-slate-300">{review.comments}</p>
                  </div>
                )}

                {review.respondedAt && (
                  <p className="text-[10px] text-slate-500">
                    Responded {new Date(review.respondedAt).toLocaleDateString()}
                  </p>
                )}

                {/* Allow reviewer to update their review */}
                {currentUser?.email === review.reviewerEmail && review.status === 'PENDING' && (
                  <ReviewResponseForm
                    reviewId={review.id}
                    onSubmit={(status, comments) => onUpdateReview(review.id, status, comments)}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-center">
            <div>
              <p className="text-xs text-slate-400">No review requests yet</p>
              {isOwner && (
                <p className="text-[10px] text-slate-500 mt-1">Request a review to get started</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface ReviewResponseFormProps {
  reviewId: string;
  onSubmit: (status: 'APPROVED' | 'NEEDS_CHANGES' | 'REJECTED', comments: string) => void;
}

const ReviewResponseForm: React.FC<ReviewResponseFormProps> = ({ reviewId, onSubmit }) => {
  const [status, setStatus] = useState<'APPROVED' | 'NEEDS_CHANGES' | 'REJECTED'>('APPROVED');
  const [comments, setComments] = useState('');

  const handleSubmit = () => {
    onSubmit(status, comments);
  };

  return (
    <div className="mt-3 p-2 bg-slate-800/40 rounded space-y-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as any)}
        className="w-full px-2 py-1.5 text-xs bg-slate-700 border border-slate-600 rounded text-slate-200"
      >
        <option value="APPROVED">Approve</option>
        <option value="NEEDS_CHANGES">Needs Changes</option>
        <option value="REJECTED">Reject</option>
      </select>

      <textarea
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        placeholder="Add comments..."
        className="w-full px-2 py-1.5 text-xs bg-slate-700 border border-slate-600 rounded text-slate-200 placeholder-slate-500 resize-none"
        rows={2}
      />

      <button
        onClick={handleSubmit}
        className="w-full px-2 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
      >
        Submit Review
      </button>
    </div>
  );
};
