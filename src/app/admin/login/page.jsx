'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ShieldCheck, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/admin';

  const [passkey, setPasskey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!passkey.trim()) {
      setError('Please enter the administrator access passkey.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push(returnUrl);
        router.refresh();
      } else {
        setError(data.message || 'Invalid credentials. Access denied.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-md w-full p-8 border border-subtle bg-surface shadow-xl rounded-2xl">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
          <Lock size={28} />
        </div>
        <h1 className="text-2xl font-bold text-primary font-display">
          Tainaati Staff Portal
        </h1>
        <p className="text-xs text-secondary mt-1">
          Restricted Administrative Access & Pipeline Telemetry
        </p>
      </div>

      {error && (
        <div className="p-3.5 mb-5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-500 font-medium">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
            Admin Passkey
          </label>
          <div className="relative">
            <input
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              placeholder="Enter authorized passkey..."
              className="input-field w-full pl-10 pr-4 py-2.5 text-sm rounded-lg"
              autoFocus
            />
            <KeyRound size={16} className="absolute left-3.5 top-3 text-muted" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full py-2.5 flex items-center justify-center gap-2 font-semibold text-sm rounded-lg"
        >
          {loading ? (
            <span>Verifying Credentials...</span>
          ) : (
            <>
              <span>Authenticate & Access Dashboard</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-subtle text-center text-xs text-muted flex items-center justify-center gap-1.5">
        <ShieldCheck size={14} className="text-emerald-500" />
        <span>Protected by Edge Auth Middleware & Session Encryption</span>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-center p-8 text-secondary">Loading secure login portal...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
