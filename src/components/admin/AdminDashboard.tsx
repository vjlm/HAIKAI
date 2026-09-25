import React, { useState, useEffect } from 'react';
import {
  LogOut,
  Eye,
  ArrowLeft,
  RefreshCw,
  Save,
  CheckCircle2,
  Clock,
  Film,
  Plus,
  Trash2,
  Edit,
  Image as ImageIcon,
  Compass,
  AlertTriangle,
  Play,
  Layers,
  Settings,
} from 'lucide-react';
import { SiteSettings, MangaRelease, GalleryItem, TrailerItem } from '../../types/haikai';
import { ImageInputWithCrop } from '../common/ImageInputWithCrop';
import { parseVideoEmbed } from '../TrailersSection';

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
  const [activeTab, setActiveTab] = useState<'manga' | 'trailers' | 'gallery' | 'settings'>('manga');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [mangaRelease, setMangaRelease] = useState<MangaRelease | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [trailers, setTrailers] = useState<TrailerItem[]>([]);

  // Editing state for trailers
  const [editingTrailer, setEditingTrailer] = useState<Partial<TrailerItem> | null>(null);
  const [isNewTrailer, setIsNewTrailer] = useState(false);

  // Editing state for gallery
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryItem> | null>(null);
  const [isNewGallery, setIsNewGallery] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        setMangaRelease(data.mangaRelease);
        setGalleryItems(data.galleryItems || []);
        setTrailers(data.trailers || []);
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

  const showFeedback = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 4000);
  };

  // 1. Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        showFeedback('Portal settings and branding updated.');
      }
    } catch {
      showFeedback('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  // 2. Save Manga Release
  const handleSaveManga = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mangaRelease) return;
    setSaving(true);

    try {
      const res = await fetch('/api/admin/manga', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mangaRelease),
      });

      if (res.ok) {
        showFeedback('Manga serialization, cover, and countdown schedule saved.');
      }
    } catch {
      showFeedback('Failed to save manga release.');
    } finally {
      setSaving(false);
    }
  };

  // 3. Save Trailer
  const handleSaveTrailer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrailer || !editingTrailer.title || !editingTrailer.videoUrl) return;
    setSaving(true);

    try {
      if (isNewTrailer) {
        const res = await fetch('/api/admin/trailers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trailer: editingTrailer }),
        });
        if (res.ok) {
          const data = await res.json();
          setTrailers(data.trailers);
          setEditingTrailer(null);
          setIsNewTrailer(false);
          showFeedback('New trailer published to archive.');
        }
      } else {
        const res = await fetch(`/api/admin/trailers/${editingTrailer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingTrailer),
        });
        if (res.ok) {
          const data = await res.json();
          setTrailers(data.trailers);
          setEditingTrailer(null);
          showFeedback('Trailer updated successfully.');
        }
      }
    } catch {
      showFeedback('Failed to save trailer.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTrailer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trailer video?')) return;
    try {
      const res = await fetch(`/api/admin/trailers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setTrailers(data.trailers);
        showFeedback('Trailer deleted.');
      }
    } catch {
      showFeedback('Failed to delete trailer.');
    }
  };

  // 4. Save Gallery Item
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery || !editingGallery.title) return;
    setSaving(true);

    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: editingGallery }),
      });
      if (res.ok) {
        const data = await res.json();
        setGalleryItems(data.galleryItems);
        setEditingGallery(null);
        setIsNewGallery(false);
        showFeedback('Gallery artwork saved.');
      }
    } catch {
      showFeedback('Failed to save gallery item.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery artwork?')) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGalleryItems((prev) => prev.filter((g) => g.id !== id));
        showFeedback('Artwork deleted.');
      }
    } catch {
      showFeedback('Failed to delete gallery item.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] text-[#c4ccd6] flex flex-col font-sans">
      {/* Top Admin Navigation Bar */}
      <header className="border-b border-[#1b2533] bg-[#080c12] px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="font-jp text-xl text-[#9e2a2b] font-bold">灰海</span>
          <h1 className="font-cinzel text-sm sm:text-base tracking-widest uppercase font-bold text-white">
            HAIKAI ARCHIVE CONTROL PANEL
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onPreviewSite}
            type="button"
            className="px-3 py-1.5 border border-[#2b394c] bg-[#0c121b] text-xs font-editorial-mono hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-[#9e2a2b]" />
            <span className="hidden sm:inline">PREVIEW SITE</span>
          </button>

          <button
            onClick={onExitAdmin}
            type="button"
            className="px-3 py-1.5 border border-[#2b394c] bg-[#0c121b] text-xs font-editorial-mono hover:text-white transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">EXIT</span>
          </button>

          <button
            onClick={onLogout}
            type="button"
            className="px-3 py-1.5 border border-[#4a181b] bg-[#16070a] text-xs font-editorial-mono text-[#f2afb2] hover:bg-[#250b10] transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOGOUT</span>
          </button>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <div className="border-b border-[#17202c] bg-[#06090e] px-4 sm:px-6 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex items-center gap-2 py-2">
          <button
            onClick={() => setActiveTab('manga')}
            className={`flex items-center gap-2 px-4 py-2 border text-xs font-cinzel tracking-wider uppercase transition-colors shrink-0 ${
              activeTab === 'manga'
                ? 'border-[#9e2a2b] bg-[#1a080b] text-[#f2afb2] font-bold'
                : 'border-transparent text-[#7a8899] hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-[#9e2a2b]" />
            <span>MANGA & COUNTDOWN</span>
          </button>

          <button
            onClick={() => setActiveTab('trailers')}
            className={`flex items-center gap-2 px-4 py-2 border text-xs font-cinzel tracking-wider uppercase transition-colors shrink-0 ${
              activeTab === 'trailers'
                ? 'border-[#9e2a2b] bg-[#1a080b] text-[#f2afb2] font-bold'
                : 'border-transparent text-[#7a8899] hover:text-white'
            }`}
          >
            <Film className="w-4 h-4 text-[#9e2a2b]" />
            <span>TRAILERS & VIDEOS ({trailers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2 border text-xs font-cinzel tracking-wider uppercase transition-colors shrink-0 ${
              activeTab === 'gallery'
                ? 'border-[#9e2a2b] bg-[#1a080b] text-[#f2afb2] font-bold'
                : 'border-transparent text-[#7a8899] hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#9e2a2b]" />
            <span>GALLERY ARTWORKS ({galleryItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 border text-xs font-cinzel tracking-wider uppercase transition-colors shrink-0 ${
              activeTab === 'settings'
                ? 'border-[#9e2a2b] bg-[#1a080b] text-[#f2afb2] font-bold'
                : 'border-transparent text-[#7a8899] hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 text-[#9e2a2b]" />
            <span>PORTAL & BRANDING</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {message && (
          <div className="p-4 border border-emerald-800/60 bg-[#06140f] text-emerald-400 text-xs font-editorial-mono flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center font-editorial-mono text-sm text-[#616e7e]">
            [ RETRIEVING AUTHORIZED ARCHIVES... ]
          </div>
        ) : (
          <>
            {/* ==============================================================
                TAB 1: MANGA & COUNTDOWN (with Crop & Link)
               ============================================================== */}
            {activeTab === 'manga' && mangaRelease && (
              <div className="border border-[#1f2837] bg-[#080c12] p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#161d28]">
                  <h2 className="font-cinzel text-lg text-white uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#9e2a2b]" />
                    <span>VOLUME 01 SERIALIZATION & COUNTDOWN</span>
                  </h2>
                  <span className="text-xs font-editorial-mono text-[#9e2a2b] font-bold">
                    STATUS: {mangaRelease.status}
                  </span>
                </div>

                <form onSubmit={handleSaveManga} className="space-y-6">
                  {/* Image Input with Link & Crop */}
                  <ImageInputWithCrop
                    label="MANGA COVER ARTWORK (LINK OR UPLOAD + CROP)"
                    value={mangaRelease.coverImage}
                    onChange={(newUrl) => setMangaRelease({ ...mangaRelease, coverImage: newUrl })}
                    aspectRatioPreset="3:4"
                    placeholder="https://... or /assets/manga_vol_01_cover.webp"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        CHAPTER RANGE:
                      </label>
                      <input
                        type="text"
                        value={mangaRelease.chapterRange}
                        onChange={(e) => setMangaRelease({ ...mangaRelease, chapterRange: e.target.value })}
                        className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                        UNSEALING SCHEDULE DATE / TIME:
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
                        <option value="Scheduled">Scheduled (Live Countdown Active)</option>
                        <option value="Released">Released (Now Published)</option>
                        <option value="Hidden">Hidden</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                      READER / STORE TARGET URL:
                    </label>
                    <input
                      type="url"
                      value={mangaRelease.mangaUrl}
                      onChange={(e) => setMangaRelease({ ...mangaRelease, mangaUrl: e.target.value })}
                      className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                      DESCRIPTION / SYNOPSIS:
                    </label>
                    <textarea
                      rows={3}
                      value={mangaRelease.description}
                      onChange={(e) => setMangaRelease({ ...mangaRelease, description: e.target.value })}
                      className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto px-8 py-3 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs font-cinzel tracking-widest uppercase font-semibold border border-[#9e2a2b] transition-all disabled:opacity-50"
                  >
                    {saving ? '[ SAVING... ]' : '[ SAVE MANGA & COUNTDOWN ]'}
                  </button>
                </form>
              </div>
            )}

            {/* ==============================================================
                TAB 2: TRAILERS & VIDEOS (Add/Remove/Edit with links & crop)
               ============================================================== */}
            {activeTab === 'trailers' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1b2533] pb-4">
                  <div>
                    <h2 className="font-cinzel text-lg text-white uppercase tracking-wider flex items-center gap-2">
                      <Film className="w-4 h-4 text-[#9e2a2b]" />
                      <span>OFFICIAL TRAILERS & VIDEO ARCHIVES</span>
                    </h2>
                    <p className="text-xs font-editorial-mono text-[#6c7d90]">
                      Add, update, or remove YouTube, Vimeo, or MP4 trailers on the site anytime.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingTrailer({
                        id: `pv-${Date.now()}`,
                        title: '',
                        japanese: '',
                        videoUrl: '',
                        thumbnailUrl: '',
                        category: 'Official Trailer',
                        duration: '01:45',
                        releaseDate: '2026',
                        description: '',
                        status: 'Published',
                      });
                      setIsNewTrailer(true);
                    }}
                    className="px-4 py-2 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs font-cinzel tracking-wider uppercase font-semibold flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD NEW TRAILER</span>
                  </button>
                </div>

                {/* Edit / Add Trailer Modal Form */}
                {editingTrailer && (
                  <div className="border-2 border-[#9e2a2b]/60 bg-[#090e15] p-6 space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-[#1d2737]">
                      <h3 className="font-cinzel text-base text-white uppercase">
                        {isNewTrailer ? 'NEW TRAILER RECORD' : `EDITING: ${editingTrailer.title}`}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTrailer(null);
                          setIsNewTrailer(false);
                        }}
                        className="text-xs font-editorial-mono text-[#818f9f] hover:text-white"
                      >
                        [ CANCEL ]
                      </button>
                    </div>

                    <form onSubmit={handleSaveTrailer} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            TRAILER TITLE *:
                          </label>
                          <input
                            type="text"
                            required
                            value={editingTrailer.title || ''}
                            onChange={(e) => setEditingTrailer({ ...editingTrailer, title: e.target.value })}
                            placeholder="e.g. Official Teaser PV 01: The Sea of Ash"
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            JAPANESE TITLE:
                          </label>
                          <input
                            type="text"
                            value={editingTrailer.japanese || ''}
                            onChange={(e) => setEditingTrailer({ ...editingTrailer, japanese: e.target.value })}
                            placeholder="e.g. 灰海 始動特報"
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                          VIDEO LINK (YOUTUBE, VIMEO, OR DIRECT MP4) *:
                        </label>
                        <input
                          type="url"
                          required
                          value={editingTrailer.videoUrl || ''}
                          onChange={(e) => setEditingTrailer({ ...editingTrailer, videoUrl: e.target.value })}
                          placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/... or .mp4"
                          className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                        />
                        <span className="text-[10px] text-[#556475] block">
                          Tip: For YouTube, thumbnail will automatically resolve if left blank!
                        </span>
                      </div>

                      {/* Thumbnail Input with Crop & Link */}
                      <ImageInputWithCrop
                        label="CUSTOM TRAILER THUMBNAIL (OPTIONAL LINK OR UPLOAD + CROP)"
                        value={editingTrailer.thumbnailUrl || ''}
                        onChange={(newUrl) => setEditingTrailer({ ...editingTrailer, thumbnailUrl: newUrl })}
                        aspectRatioPreset="16:9"
                        placeholder="https://... or empty for automatic YouTube thumbnail"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            CATEGORY:
                          </label>
                          <select
                            value={editingTrailer.category || 'Official Trailer'}
                            onChange={(e) => setEditingTrailer({ ...editingTrailer, category: e.target.value })}
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          >
                            <option value="Official Trailer">Official Trailer</option>
                            <option value="Official Teaser">Official Teaser</option>
                            <option value="Main Trailer">Main Trailer</option>
                            <option value="Character PV">Character PV</option>
                            <option value="Behind The Scenes">Behind The Scenes</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            DURATION:
                          </label>
                          <input
                            type="text"
                            value={editingTrailer.duration || '01:45'}
                            onChange={(e) => setEditingTrailer({ ...editingTrailer, duration: e.target.value })}
                            placeholder="01:45"
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            STATUS:
                          </label>
                          <select
                            value={editingTrailer.status || 'Published'}
                            onChange={(e) => setEditingTrailer({ ...editingTrailer, status: e.target.value as any })}
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          >
                            <option value="Published">Published (Visible on site)</option>
                            <option value="Draft">Draft (Owner only)</option>
                            <option value="Hidden">Hidden</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                          DESCRIPTION / SYNOPSIS:
                        </label>
                        <textarea
                          rows={2}
                          value={editingTrailer.description || ''}
                          onChange={(e) => setEditingTrailer({ ...editingTrailer, description: e.target.value })}
                          className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={saving}
                          className="px-6 py-2.5 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs font-cinzel tracking-wider uppercase font-semibold flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>{saving ? 'SAVING...' : 'SAVE TRAILER RECORD'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTrailer(null);
                            setIsNewTrailer(false);
                          }}
                          className="px-4 py-2 border border-[#232f3f] text-xs font-editorial-mono text-[#7a8999] hover:text-white"
                        >
                          CANCEL
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Trailers List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trailers.map((t) => {
                    const info = parseVideoEmbed(t.videoUrl);
                    const thumb = t.thumbnailUrl || info.thumbnail || '/assets/manga_vol_01_cover.webp';
                    return (
                      <div
                        key={t.id}
                        className="border border-[#1a2533] bg-[#070b10] p-4 flex flex-col justify-between gap-4"
                      >
                        <div className="flex gap-4">
                          <div className="w-32 aspect-video bg-[#0d131c] border border-[#1f2c3d] shrink-0 overflow-hidden relative">
                            <img src={thumb} alt={t.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <Play className="w-5 h-5 text-white/80" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-editorial-mono px-1.5 py-0.5 border border-[#2f3f54] text-[#9e2a2b]">
                                {t.category}
                              </span>
                              <span className="text-[10px] font-editorial-mono text-[#5f7082]">
                                {t.duration}
                              </span>
                            </div>
                            <h4 className="font-cinzel text-sm text-[#edf1f5] uppercase truncate font-semibold">
                              {t.title}
                            </h4>
                            <p className="text-xs text-[#718090] line-clamp-2">
                              {t.description || t.videoUrl}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#131b26] pt-3 text-xs font-editorial-mono">
                          <span className={t.status === 'Published' ? 'text-emerald-400' : 'text-[#7e8d9e]'}>
                            ● {t.status}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingTrailer(t);
                                setIsNewTrailer(false);
                              }}
                              className="px-2.5 py-1 border border-[#2b394d] bg-[#0c121b] text-white hover:border-[#9e2a2b] flex items-center gap-1 text-[11px]"
                            >
                              <Edit className="w-3 h-3" />
                              <span>EDIT</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTrailer(t.id)}
                              className="px-2.5 py-1 border border-[#4a181b] bg-[#16070a] text-[#f2afb2] hover:bg-[#250b10] flex items-center gap-1 text-[11px]"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>DELETE</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ==============================================================
                TAB 3: GALLERY ARTWORKS (Add/Remove with link & crop)
               ============================================================== */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1b2533] pb-4">
                  <div>
                    <h2 className="font-cinzel text-lg text-white uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#9e2a2b]" />
                      <span>KEY ART & VISUAL CHRONICLE ARCHIVE</span>
                    </h2>
                    <p className="text-xs font-editorial-mono text-[#6c7d90]">
                      Add, update, or remove artworks with direct image URLs or cropped uploads.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingGallery({
                        id: `gal-${Date.now()}`,
                        title: '',
                        japanese: '',
                        category: 'LANDSCAPES',
                        description: '',
                        aspectRatio: '16:9',
                        imageUrl: '',
                        status: 'Published',
                      });
                      setIsNewGallery(true);
                    }}
                    className="px-4 py-2 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs font-cinzel tracking-wider uppercase font-semibold flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD ARTWORK</span>
                  </button>
                </div>

                {/* Edit / Add Gallery Modal Form */}
                {editingGallery && (
                  <div className="border-2 border-[#9e2a2b]/60 bg-[#090e15] p-6 space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-[#1d2737]">
                      <h3 className="font-cinzel text-base text-white uppercase">
                        {isNewGallery ? 'NEW GALLERY ARTWORK' : `EDITING: ${editingGallery.title}`}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingGallery(null);
                          setIsNewGallery(false);
                        }}
                        className="text-xs font-editorial-mono text-[#818f9f] hover:text-white"
                      >
                        [ CANCEL ]
                      </button>
                    </div>

                    <form onSubmit={handleSaveGallery} className="space-y-4">
                      {/* Image Input with Link & Crop */}
                      <ImageInputWithCrop
                        label="ARTWORK IMAGE (LINK OR UPLOAD + CROP) *"
                        value={editingGallery.imageUrl || ''}
                        onChange={(newUrl) => setEditingGallery({ ...editingGallery, imageUrl: newUrl })}
                        aspectRatioPreset={editingGallery.aspectRatio === '3:4' ? '3:4' : '16:9'}
                        placeholder="https://... or /assets/..."
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            ARTWORK TITLE *:
                          </label>
                          <input
                            type="text"
                            required
                            value={editingGallery.title || ''}
                            onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            JAPANESE TITLE:
                          </label>
                          <input
                            type="text"
                            value={editingGallery.japanese || ''}
                            onChange={(e) => setEditingGallery({ ...editingGallery, japanese: e.target.value })}
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            CATEGORY:
                          </label>
                          <select
                            value={editingGallery.category || 'LANDSCAPES'}
                            onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          >
                            <option value="CHARACTERS">CHARACTERS</option>
                            <option value="LANDSCAPES">LANDSCAPES</option>
                            <option value="THE SEA">THE SEA</option>
                            <option value="RUINS">RUINS</option>
                            <option value="WAR">WAR</option>
                            <option value="CONCEPT ART">CONCEPT ART</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            ASPECT RATIO:
                          </label>
                          <select
                            value={editingGallery.aspectRatio || '16:9'}
                            onChange={(e) => setEditingGallery({ ...editingGallery, aspectRatio: e.target.value })}
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          >
                            <option value="16:9">16:9 (Landscape)</option>
                            <option value="3:4">3:4 (Portrait)</option>
                            <option value="1:1">1:1 (Square)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            STATUS:
                          </label>
                          <select
                            value={editingGallery.status || 'Published'}
                            onChange={(e) => setEditingGallery({ ...editingGallery, status: e.target.value as any })}
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          >
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                            <option value="Hidden">Hidden</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                          DESCRIPTION:
                        </label>
                        <textarea
                          rows={2}
                          value={editingGallery.description || ''}
                          onChange={(e) => setEditingGallery({ ...editingGallery, description: e.target.value })}
                          className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={saving}
                          className="px-6 py-2.5 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs font-cinzel tracking-wider uppercase font-semibold flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>{saving ? 'SAVING...' : 'SAVE ARTWORK'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingGallery(null);
                            setIsNewGallery(false);
                          }}
                          className="px-4 py-2 border border-[#232f3f] text-xs font-editorial-mono text-[#7a8999] hover:text-white"
                        >
                          CANCEL
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Gallery Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-[#1a2533] bg-[#070b10] flex flex-col justify-between overflow-hidden"
                    >
                      <div className="aspect-video w-full bg-[#0d131c] overflow-hidden relative">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                            <span className="font-jp text-lg text-[#556475]">{item.japanese}</span>
                            <span className="font-cinzel text-xs text-[#9aa7b7]">{item.title}</span>
                          </div>
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-[10px] font-editorial-mono text-[#f2afb2]">
                          {item.category}
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="font-cinzel text-sm text-[#edf1f5] uppercase truncate font-semibold">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#718090] line-clamp-2">
                          {item.description}
                        </p>

                        <div className="flex items-center justify-between border-t border-[#131b26] pt-3 text-xs font-editorial-mono">
                          <span className={item.status === 'Published' ? 'text-emerald-400' : 'text-[#7e8d9e]'}>
                            ● {item.status}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingGallery(item);
                                setIsNewGallery(false);
                              }}
                              className="px-2 py-1 border border-[#2b394d] bg-[#0c121b] text-white hover:border-[#9e2a2b] text-[11px]"
                            >
                              EDIT
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteGallery(item.id)}
                              className="px-2 py-1 border border-[#4a181b] bg-[#16070a] text-[#f2afb2] hover:bg-[#250b10] text-[11px]"
                            >
                              DELETE
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==============================================================
                TAB 4: PORTAL & BRANDING (with Crop & Link)
               ============================================================== */}
            {activeTab === 'settings' && settings && (
              <div className="border border-[#1f2837] bg-[#080c12] p-6 sm:p-8 space-y-6">
                <div className="pb-3 border-b border-[#161d28]">
                  <h2 className="font-cinzel text-lg text-white uppercase tracking-wider flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#9e2a2b]" />
                    <span>PORTAL METADATA & BRANDING</span>
                  </h2>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        JAPANESE TITLE:
                      </label>
                      <input
                        type="text"
                        value={settings.japaneseTitle}
                        onChange={(e) => setSettings({ ...settings, japaneseTitle: e.target.value })}
                        className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        HERO NOTICE BADGE:
                      </label>
                      <input
                        type="text"
                        value={settings.heroNotice}
                        onChange={(e) => setSettings({ ...settings, heroNotice: e.target.value })}
                        className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                      SEO DESCRIPTION:
                    </label>
                    <textarea
                      rows={2}
                      value={settings.seoDescription}
                      onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                      className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto px-8 py-3 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs font-cinzel tracking-widest uppercase font-semibold border border-[#9e2a2b] transition-all disabled:opacity-50"
                  >
                    {saving ? '[ SAVING... ]' : '[ SAVE PORTAL SETTINGS ]'}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
