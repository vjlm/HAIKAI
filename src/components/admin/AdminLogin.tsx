import React, { useState } from 'react';
import { Lock, Shield, ArrowLeft, KeyRound } from 'lucide-react';
import { setAdminToken } from '../../utils/adminApi';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.token) {
          setAdminToken(data.token);
        }
        onLoginSuccess();
      } else {
        setError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setError('Connection failure communicating with authentication service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040507] flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-[#222d3b] bg-[#080c12] p-8 space-y-6 relative shadow-2xl">
        <button
          onClick={onCancel}
          type="button"
          className="inline-flex items-center gap-2 text-xs font-editorial-mono text-[#667485] hover:text-[#c4ccd6] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO PUBLIC SITE</span>
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-[#1b080b] border border-[#9e2a2b] text-[#9e2a2b]">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="font-cinzel text-xl text-[#edf1f5] uppercase tracking-wider">
            OWNER CMS GATEWAY
          </h2>
          <p className="text-xs font-editorial-mono text-[#6b7888]">
            ENTER AUTHORIZED CREDENTIALS TO MANAGE HAIKAI CANONICAL ARCHIVE
          </p>
        </div>

        {error && (
          <div className="p-3 border border-[#4a181b] bg-[#140608] text-[#f2afb2] text-xs font-editorial-mono leading-relaxed">
            [!] {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-editorial-mono tracking-widest text-[#788698] uppercase block">
              MASTER ACCESS KEY:
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                required
                className="w-full bg-[#05070a] border border-[#1b2533] focus:border-[#9e2a2b] px-3.5 py-2.5 text-sm text-[#edf1f5] font-editorial-mono placeholder:text-[#384355] outline-none transition-colors"
              />
              <KeyRound className="w-4 h-4 text-[#445263] absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs font-cinzel tracking-widest uppercase font-semibold border border-[#9e2a2b] transition-all disabled:opacity-50"
          >
            {loading ? '[ AUTHENTICATING... ]' : '[ ACCESS CONTROL PANEL ]'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#131a24]">
          <p className="text-[10px] font-editorial-mono text-[#445263]">
            DEFAULT PASS: haikai-sea-of-ash-2026
          </p>
        </div>
      </div>
    </div>
  );
};
