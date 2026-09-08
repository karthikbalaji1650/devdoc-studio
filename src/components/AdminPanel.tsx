import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, BarChart3, Settings, LogOut } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { user, logout } = useAuth();

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="bg-slate-800 border-t border-slate-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Admin Panel</p>
            <p className="text-xs text-slate-400">Logged in as: {user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={logout}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Admin Quick Stats */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="bg-slate-700/50 p-3 rounded">
          <p className="text-xs text-slate-400 mb-1">Active Users</p>
          <p className="text-lg font-bold text-blue-400">12</p>
        </div>
        <div className="bg-slate-700/50 p-3 rounded">
          <p className="text-xs text-slate-400 mb-1">Documents</p>
          <p className="text-lg font-bold text-green-400">48</p>
        </div>
        <div className="bg-slate-700/50 p-3 rounded">
          <p className="text-xs text-slate-400 mb-1">Exports</p>
          <p className="text-lg font-bold text-purple-400">156</p>
        </div>
      </div>
    </div>
  );
};
