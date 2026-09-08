import type { User } from '../types/auth';
import type { DocumentMetadata } from '../types/document';

export const canEditDocument = (user: User | null, docMetadata: DocumentMetadata): boolean => {
  if (!user) return false;
  
  // Admins can edit everything
  if (user.role === 'admin') return true;
  
  // Regular users can only edit their own documents
  return user.id === docMetadata.ownerId;
};

export const canViewDocument = (user: User | null, docMetadata: DocumentMetadata): boolean => {
  if (!user) return false;
  
  // Admins can view everything
  if (user.role === 'admin') return true;
  
  // Regular users can only view their own documents
  return user.id === docMetadata.ownerId;
};

export const canDeleteDocument = (user: User | null, docMetadata: DocumentMetadata): boolean => {
  if (!user) return false;
  
  // Admins can delete everything
  if (user.role === 'admin') return true;
  
  // Regular users can only delete their own documents
  return user.id === docMetadata.ownerId;
};

export const getDocumentAccessLevel = (user: User | null, docMetadata: DocumentMetadata): 'none' | 'view' | 'edit' | 'admin' => {
  if (!user) return 'none';
  
  if (user.role === 'admin') return 'admin';
  if (user.id === docMetadata.ownerId) return 'edit';
  
  return 'none';
};
