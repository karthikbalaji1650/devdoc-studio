import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, Loader } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetMessage(null);

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetMessage(null);

    if (!email.trim()) {
      setError('Enter your email address to reset your password');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsResetting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setResetMessage(`Password reset instructions have been sent to ${email.trim()}.`);
    setShowForgotPassword(false);
    setIsResetting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">DocCraft Studio</h1>
          <p className="text-slate-400">Developer Documentation Generator</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-8">
          <form onSubmit={showForgotPassword ? handlePasswordReset : handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                {showForgotPassword ? 'Reset Email' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={showForgotPassword ? 'Enter your account email' : 'Enter your email'}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading || isResetting}
                />
              </div>
            </div>

            {!showForgotPassword && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {!showForgotPassword && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setResetMessage(null);
                    setShowForgotPassword(true);
                  }}
                  disabled={isLoading || isResetting}
                  className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {showForgotPassword && (
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setError(null);
                  setResetMessage(null);
                }}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                ← Back to sign in
              </button>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {resetMessage && (
              <div className="bg-emerald-900/20 border border-emerald-700 rounded-lg p-3 text-sm text-emerald-300">
                {resetMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isResetting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : isResetting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Sending reset link...
                </>
              ) : showForgotPassword ? (
                'Send Reset Link'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              Demo Credentials
            </p>
            <div className="space-y-2 text-sm">
              <div className="bg-slate-700/50 p-3 rounded">
                <p className="text-slate-300">
                  <span className="font-semibold">Admin:</span> admin@doccraft.com
                </p>
                <p className="text-slate-400 text-xs">password: admin123</p>
              </div>
              <div className="bg-slate-700/50 p-3 rounded">
                <p className="text-slate-300">
                  <span className="font-semibold">User:</span> user@doccraft.com
                </p>
                <p className="text-slate-400 text-xs">password: user123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          © 2026 DocCraft Studio. All rights reserved.
        </p>
      </div>
    </div>
  );
};
