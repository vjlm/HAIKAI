import React, { useState, useEffect } from 'react';
import { LogOut, Eye, ArrowLeft, RefreshCw, Save, CheckCircle2, Clock } from 'lucide-react';
import { SiteSettings, MangaRelease } from '../../types/haikai';

interface AdminDashboardProps {
  onLogout: () => void;
  onPreviewSite: () => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onPreviewSite,
  onExitAdmin,
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [mangaRelease, setMangaRelease] = useState<MangaRelease | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        setMangaRelease(data.mangaRelease);
      }
    } catch {
      // Error fetching
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage('Site settings updated successfully.');
      }
    } catch {
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveManga = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mangaRelease) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/manga', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mangaRelease),
      });

      if (res.ok) {
        setMessage('Manga release and countdown schedule saved.');
      }
    } catch {
      setMessage('Failed to save manga release.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] text-[#c4ccd6] flex flex-col">
      {/* Top Admin Header */}
      <header className="border-b border-[#1b2533] bg-[#080c12] px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="font-jp text-xl text-[#9e2a2b]">灰海</span>
          <h1 className="font-cinzel text-base tracking-widest uppercase font-bold text-white">
            HAIKAI ARCHIVE CONTROL PANEL
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onPreviewSite}
            type="button"
            className="px-3.5 py-1.5 border border-[#2b394c] bg-[#0c121b] text-xs font-editorial-mono hover:text-white transition-colors flex items-center gap-2"
          >
            <Eye className="w-3.5 h-3.5 text-[#9e2a2b]" />
            <span>PREVIEW SITE</span>
          </button>

          <button
            onClick={onExitAdmin}
            type="button"
            className="px-3.5 py-1.5 border border-[#2b394c] bg-[#0c121b] text-xs font-editorial-mono hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>EXIT TO SITE</span>
          </button>

          <button
            onClick={onLogout}
            type="button"
            className="px-3.5 py-1.5 border border-[#4a181b] bg-[#16070a] text-xs font-editorial-mono text-[#f2afb2] hover:bg-[#250b10] transition-colors flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOGOUT</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 sm:p-8 space-y-8">
        {message && (
          <div className="p-4 border border-emerald-800/60 bg-[#06140f] text-emerald-400 text-xs font-editorial-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center font-editorial-mono text-sm text-[#616e7e]">
            [ LOADING ARCHIVE DATA... ]
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Manga Countdown & Release Schedule */}
            {mangaRelease && (
              <div className="border border-[#1f2837] bg-[#080c12] p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#161d28]">
                  <h2 className="font-cinzel text-lg text-white uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#9e2a2b]" />
                    <span>MANGA SERIALIZATION & TIMER</span>
                  </h2>
                  <span className="text-xs font-editorial-mono text-[#9e2a2b]">
                    STATUS: {mangaRelease.status}
                  </span>
                </div>

                <form onSubmit={handleSaveManga} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                      VOLUME TITLE:
                    </label>
                    <input
                      type="text"
                      value={mangaRelease.title}
                      onChange={(e) => setMangaRelease({ ...mangaRelease, title: e.target.value })}
                      className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                      RELEASE DATE / TIME (ISO or Local):
                    </label>
                    <input
                      type="text"
                      value={mangaRelease.releaseAt}
                      onChange={(e) => setMangaRelease({ ...mangaRelease, releaseAt: e.target.value })}
                      className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                      PUBLICATION STATUS:
                    </label>
                    <select
                      value={mangaRelease.status}
                      onChange={(e) => setMangaRelease({ ...mangaRelease, status: e.target.value as any })}
                      className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                    >
                      <option value="Scheduled">Scheduled (Active Countdown)</option>
                      <option value="Released">Released (Now Published)</option>
                      <option value="Hidden">Hidden</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                      READER / STORE URL:
                    </label>
                    <input
                      type="url"
                      value={mangaRelease.mangaUrl}
                      onChange={(e) => setMangaRelease({ ...mangaRelease, mangaUrl: e.target.value })}
                      className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-2.5 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs font-cinzel tracking-widest uppercase font-semibold border border-[#9e2a2b] transition-all disabled:opacity-50"
                  >
                    [ SAVE MANGA SCHEDULE ]
                  </button>
                </form>
              </div>
            )}

            {/* General Site Metadata */}
            {settings && (
              <div className="border border-[#1f2837] bg-[#080c12] p-6 space-y-5">
                <div className="pb-3 border-b border-[#161d28]">
                  <h2 className="font-cinzel text-lg text-white uppercase tracking-wider">
                    PORTAL METADATA & COPY
                  </h2>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                      SITE TITLE:
                    </label>
                    <input
                      type="text"
                      value={settings.siteTitle}
                      onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                      className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                      TAGLINE:
                    </label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                      HERO NOTICE:
                    </label>
                    <input
                      type="text"
                      value={settings.heroNotice}
                      onChange={(e) => setSettings({ ...settings, heroNotice: e.target.value })}
                      className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-2.5 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs font-cinzel tracking-widest uppercase font-semibold border border-[#9e2a2b] transition-all disabled:opacity-50"
                  >
                    [ SAVE PORTAL SETTINGS ]
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
