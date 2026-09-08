import React from 'react';
import { useAuth } from '../context/AuthContext';

export const RoleGuard: React.FC<{
  children: React.ReactNode;
  requiredRoles?: Array<'admin' | 'user'>;
  fallback?: React.ReactNode;
}> = ({ children, requiredRoles, fallback = null }) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
