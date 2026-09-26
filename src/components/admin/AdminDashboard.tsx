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
  Users,
  Globe,
  Palette,
  Layout,
  Sparkles,
  Check,
  Shield,
  Volume2,
  ExternalLink,
  ChevronRight,
  Calendar,
  Star,
  BookOpen,
  Tag,
} from 'lucide-react';
import {
  SiteSettings,
  MangaRelease,
  GalleryItem,
  TrailerItem,
  Character,
  Region,
  VisibleSections,
} from '../../types/haikai';
import { ImageInputWithCrop } from '../common/ImageInputWithCrop';
import { parseVideoEmbed } from '../TrailersSection';
import { adminFetch } from '../../utils/adminApi';

interface AdminDashboardProps {
  onLogout: () => void;
  onPreviewSite: () => void;
  onExitAdmin: () => void;
}

type AdminTab =
  | 'manga'
  | 'trailers'
  | 'gallery'
  | 'characters'
  | 'regions'
  | 'layout'
  | 'appearance'
  | 'settings';

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteTitle: 'HAIKAI — The Sea of Ash',
  siteSubtitle: 'THE SEA OF ASH',
  japaneseTitle: '灰海',
  tagline: '“Was this world ever meant to be saved?”',
  ctaPrimaryLabel: '[ ENTER THE WORLD → ]',
  ctaPrimaryLink: '#manga',
  ctaSecondaryLabel: '[ MEET THE CHARACTERS ]',
  ctaSecondaryLink: '#characters',
  heroNotice: '',
  showHeroNotice: false,
  accentColor: '#9e2a2b',
  showAshParticles: true,
  animationSpeed: 'cinematic',
  visibleSections: {
    introduction: true,
    seaOfAsh: true,
    world: true,
    characters: true,
    ashSection: true,
    relationships: true,
    romance: true,
    oathSystem: true,
    storyArcs: true,
    mysteries: true,
    manga: true,
    warRecords: true,
    trailers: true,
    gallery: true,
    finalQuestion: true,
  },
  socialLinks: {
    x: 'https://x.com/haikai_official',
    instagram: 'https://instagram.com/haikai_manga',
    youtube: 'https://youtube.com',
    discord: 'https://discord.gg',
  },
  footerCredits: 'HAIKAI PRODUCTION COMMITTEE · ALL RIGHTS RESERVED',
  seoDescription:
    'Enter the world of HAIKAI — a dark fantasy mystery surrounding the Sea of Ash, the First Flood, and a civilization built on forgotten truth.',
  updatedAt: new Date().toISOString(),
};

const DEFAULT_MANGA_FALLBACK: MangaRelease = {
  id: 'manga-vol-01',
  title: 'HAIKAI — THE SEA OF ASH',
  volumeNumber: 'Volume 01',
  subtitle: 'FIRST PUBLICATION · CHAPTERS 01–05',
  chapterRange: 'Chapters 01–05: The Salvage Boy to The War Records',
  category: 'Manga Volume',
  description: 'Seventeen-year-old salvage diver Nero Vale pulls an impossible pre-Flood bronze cylinder from the midnight shelf, triggering an imperial manhunt that shatters three thousand years of Crownlands peace.',
  coverImage: '/manga-cover-vol1.svg',
  releaseAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  mangaUrl: 'https://haikai-manga.official.jp/read/volume-01',
  status: 'Scheduled',
  openInNewTab: true,
  isFeatured: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onPreviewSite,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('manga');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [mangaRelease, setMangaRelease] = useState<MangaRelease>(DEFAULT_MANGA_FALLBACK);
  const [countdowns, setCountdowns] = useState<MangaRelease[]>([DEFAULT_MANGA_FALLBACK]);
  const [editingCountdown, setEditingCountdown] = useState<Partial<MangaRelease> | null>(null);
  const [isNewCountdown, setIsNewCountdown] = useState(false);
  const [rescheduleItem, setRescheduleItem] = useState<{
    id: string;
    title: string;
    releaseAt: string;
    status: 'Scheduled' | 'Released' | 'Hidden';
  } | null>(null);

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [trailers, setTrailers] = useState<TrailerItem[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);

  // Editing state for trailers
  const [editingTrailer, setEditingTrailer] = useState<Partial<TrailerItem> | null>(null);
  const [isNewTrailer, setIsNewTrailer] = useState(false);

  // Editing state for gallery
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryItem> | null>(null);
  const [isNewGallery, setIsNewGallery] = useState(false);

  // Editing state for characters
  const [editingCharacter, setEditingCharacter] = useState<Partial<Character> | null>(null);
  const [isNewCharacter, setIsNewCharacter] = useState(false);

  // Editing state for regions
  const [editingRegion, setEditingRegion] = useState<Partial<Region> | null>(null);
  const [isNewRegion, setIsNewRegion] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/content');
      if (res.status === 401) {
        showFeedback('Session expired. Please log in again.');
        onLogout();
        return;
      }
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings({
            ...DEFAULT_SITE_SETTINGS,
            ...data.settings,
            visibleSections: {
              ...DEFAULT_SITE_SETTINGS.visibleSections,
              ...(data.settings.visibleSections || {}),
            },
            socialLinks: {
              ...DEFAULT_SITE_SETTINGS.socialLinks,
              ...(data.settings.socialLinks || {}),
            },
          });
        }
        if (data.mangaRelease) {
          setMangaRelease({ ...DEFAULT_MANGA_FALLBACK, ...data.mangaRelease });
        }
        const rawCds =
          data.countdowns && Array.isArray(data.countdowns) && data.countdowns.length > 0
            ? data.countdowns
            : data.mangaRelease
            ? [data.mangaRelease]
            : [DEFAULT_MANGA_FALLBACK];

        const cds: MangaRelease[] = rawCds
          .filter(Boolean)
          .map((c: any, i: number) => ({
            id: c.id || `countdown-${i}-${Date.now()}`,
            title: c.title || 'HAIKAI Release',
            volumeNumber: c.volumeNumber || `Volume 0${i + 1}`,
            subtitle: c.subtitle || '',
            chapterRange: c.chapterRange || '',
            category: c.category || 'Manga',
            description: c.description || '',
            coverImage: c.coverImage || '/manga-cover-vol1.svg',
            releaseAt: c.releaseAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            mangaUrl: c.mangaUrl || 'https://haikai-manga.official.jp',
            status: c.status || 'Scheduled',
            openInNewTab: c.openInNewTab !== false,
            isFeatured: Boolean(c.isFeatured),
            createdAt: c.createdAt || new Date().toISOString(),
            updatedAt: c.updatedAt || new Date().toISOString(),
          }));

        setCountdowns(cds);
        setGalleryItems(data.galleryItems || []);
        setTrailers(data.trailers || []);
        setCharacters(data.characters || []);
        setRegions(data.regions || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showFeedback('Network error retrieving data.');
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

  // 1. Save Settings (Used for Settings, Layout, and Appearance tabs)
  const handleSaveSettings = async (e?: React.FormEvent, customSettings?: SiteSettings) => {
    if (e) e.preventDefault();
    const payload = customSettings || settings;
    if (!payload) return;
    setSaving(true);

    try {
      const res = await adminFetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        showFeedback('Portal customization & settings updated successfully.');
      }
    } catch {
      showFeedback('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  // 2. Save Manga Release / Single Countdown
  const handleSaveManga = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mangaRelease) return;
    setSaving(true);

    try {
      const res = await adminFetch('/api/admin/manga', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mangaRelease),
      });

      if (res.ok) {
        showFeedback('Manga serialization, cover, and countdown schedule saved.');
        fetchData();
      }
    } catch {
      showFeedback('Failed to save manga release.');
    } finally {
      setSaving(false);
    }
  };

  // 2b. Save / Create Countdown (for new book, volume, PV)
  const handleSaveCountdown = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCountdown || (!editingCountdown.title && !editingCountdown.volumeNumber)) return;
    setSaving(true);

    try {
      const res = await adminFetch('/api/admin/countdowns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCountdown),
      });

      if (res.ok) {
        const data = await res.json();
        setCountdowns(data.countdowns);
        if (data.mangaRelease) setMangaRelease(data.mangaRelease);
        setEditingCountdown(null);
        setIsNewCountdown(false);
        showFeedback('Countdown release saved successfully.');
      } else {
        const errData = await res.json();
        showFeedback(errData.error || 'Failed to save countdown.');
      }
    } catch {
      showFeedback('Network error saving countdown.');
    } finally {
      setSaving(false);
    }
  };

  // 2c. Reschedule Countdown (Quick Action)
  const handleRescheduleCountdown = async (
    id: string,
    releaseAt: string,
    status?: 'Scheduled' | 'Released' | 'Hidden'
  ) => {
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/countdowns/${id}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ releaseAt, status }),
      });

      if (res.ok) {
        const data = await res.json();
        setCountdowns(data.countdowns);
        if (data.mangaRelease) setMangaRelease(data.mangaRelease);
        setRescheduleItem(null);
        showFeedback('Countdown rescheduled successfully.');
      } else {
        showFeedback('Failed to reschedule countdown.');
      }
    } catch {
      showFeedback('Network error rescheduling countdown.');
    } finally {
      setSaving(false);
    }
  };

  // 2d. Feature a Countdown on Homepage
  const handleFeatureCountdown = async (id: string) => {
    try {
      const res = await adminFetch(`/api/admin/countdowns/${id}/feature`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setCountdowns(data.countdowns);
        if (data.mangaRelease) setMangaRelease(data.mangaRelease);
        showFeedback('Featured countdown updated.');
      }
    } catch {
      showFeedback('Failed to set featured countdown.');
    }
  };

  // 2e. Publish / Release Countdown immediately
  const handlePublishCountdownNow = async (id: string) => {
    if (!confirm('Unseal and immediately release this countdown for public reader access?')) return;
    try {
      const res = await adminFetch(`/api/admin/countdowns/${id}/publish-now`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setCountdowns(data.countdowns);
        if (data.mangaRelease) setMangaRelease(data.mangaRelease);
        showFeedback('Countdown released immediately! Readers unlocked.');
      }
    } catch {
      showFeedback('Failed to release countdown.');
    }
  };

  // 2f. Delete Countdown
  const handleDeleteCountdown = async (id: string) => {
    if (!confirm('Are you sure you want to delete this countdown?')) return;
    try {
      const res = await adminFetch(`/api/admin/countdowns/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        setCountdowns(data.countdowns);
        if (data.mangaRelease) setMangaRelease(data.mangaRelease);
        showFeedback('Countdown deleted.');
      } else {
        const err = await res.json();
        showFeedback(err.error || 'Failed to delete countdown.');
      }
    } catch {
      showFeedback('Failed to delete countdown.');
    }
  };

  // 3. Save Trailer
  const handleSaveTrailer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrailer || !editingTrailer.title || !editingTrailer.videoUrl) return;
    setSaving(true);

    try {
      if (isNewTrailer) {
        const res = await adminFetch('/api/admin/trailers', {
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
        const res = await adminFetch(`/api/admin/trailers/${editingTrailer.id}`, {
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
      const res = await adminFetch(`/api/admin/trailers/${id}`, { method: 'DELETE' });
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
      const res = await adminFetch('/api/admin/gallery', {
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
      showFeedback('Failed to save artwork.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery artwork?')) return;
    try {
      const res = await adminFetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setGalleryItems(data.galleryItems);
        showFeedback('Artwork deleted.');
      }
    } catch {
      showFeedback('Failed to delete artwork.');
    }
  };

  // 5. Save Character Dossier
  const handleSaveCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCharacter || !editingCharacter.name) return;
    setSaving(true);

    try {
      const res = await adminFetch('/api/admin/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ character: editingCharacter }),
      });
      if (res.ok) {
        const data = await res.json();
        setCharacters(data.characters);
        setEditingCharacter(null);
        setIsNewCharacter(false);
        showFeedback('Character dossier saved successfully.');
      }
    } catch {
      showFeedback('Failed to save character.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCharacter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this character dossier?')) return;
    try {
      const res = await adminFetch(`/api/admin/characters/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCharacters((prev) => prev.filter((c) => c.id !== id));
        showFeedback('Character dossier deleted.');
      }
    } catch {
      showFeedback('Failed to delete character.');
    }
  };

  // 6. Save Region Lore
  const handleSaveRegion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRegion || !editingRegion.name) return;
    setSaving(true);

    try {
      const res = await adminFetch('/api/admin/regions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region: editingRegion }),
      });
      if (res.ok) {
        const data = await res.json();
        setRegions(data.regions);
        setEditingRegion(null);
        setIsNewRegion(false);
        showFeedback('Region lore updated successfully.');
      }
    } catch {
      showFeedback('Failed to save region.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRegion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this world region?')) return;
    try {
      const res = await adminFetch(`/api/admin/regions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRegions((prev) => prev.filter((r) => r.id !== id));
        showFeedback('Region deleted.');
      }
    } catch {
      showFeedback('Failed to delete region.');
    }
  };

  // Helper for Section Visibility Toggles
  const updateSectionVisibility = (key: keyof VisibleSections, value: boolean) => {
    if (!settings) return;
    const updatedVisible: VisibleSections = {
      ...(settings.visibleSections || {}),
      [key]: value,
    };
    setSettings({
      ...settings,
      visibleSections: updatedVisible,
    });
  };

  const setAllSections = (val: boolean) => {
    if (!settings) return;
    const updated: VisibleSections = {
      introduction: val,
      seaOfAsh: val,
      world: val,
      characters: val,
      ashSection: val,
      relationships: val,
      romance: val,
      oathSystem: val,
      storyArcs: val,
      mysteries: val,
      manga: val,
      warRecords: val,
      trailers: val,
      gallery: val,
      finalQuestion: val,
    };
    setSettings({
      ...settings,
      visibleSections: updated,
    });
  };

  // Color preset options
  const colorPresets = [
    { label: 'Imperial Blood Crimson', hex: '#9e2a2b' },
    { label: 'Abyssal Azure', hex: '#1e6091' },
    { label: 'Golden Ash', hex: '#d4af37' },
    { label: 'Void Emerald', hex: '#2d6a4f' },
    { label: 'Midnight Violet', hex: '#7209b7' },
    { label: 'Crimson Flame', hex: '#c1121f' },
  ];

  return (
    <div className="min-h-screen bg-[#030508] text-[#c4ccd6] flex flex-col selection:bg-[#9e2a2b] selection:text-white">
      {/* Top Admin Header */}
      <header className="border-b border-[#1b2533] bg-[#070b10] px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onExitAdmin}
            className="p-1.5 text-[#7a8899] hover:text-white border border-[#1d2735] hover:border-[#38495f] bg-[#0c1219] transition-colors"
            title="Return to Public Site"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-cinzel text-sm sm:text-base tracking-widest uppercase font-bold text-white flex items-center gap-2">
              <span>HAIKAI</span>
              <span className="text-[10px] px-2 py-0.5 border border-[#9e2a2b] text-[#f2afb2] bg-[#1a080b] font-editorial-mono">
                OWNER CONTROL SUITE
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4">
          <button
            onClick={onPreviewSite}
            className="px-3 py-1.5 border border-[#273547] hover:border-[#9e2a2b] bg-[#0b1017] hover:bg-[#121924] text-xs font-editorial-mono text-[#c4ccd6] hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#9e2a2b]" />
            <span className="hidden sm:inline">LIVE PREVIEW</span>
          </button>

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-1.5 text-[#7a8899] hover:text-white border border-[#1d2735] bg-[#0c1219] transition-colors"
            title="Reload from Database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-1.5 border border-[#4a181b] bg-[#16070a] hover:bg-[#250b10] text-[#f2afb2] text-xs font-editorial-mono flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LOGOUT</span>
          </button>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <div className="border-b border-[#17202c] bg-[#06090e] px-4 sm:px-6 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 py-2">
          <button
            onClick={() => setActiveTab('manga')}
            className={`flex items-center gap-2 px-3.5 py-2 border text-xs font-cinzel tracking-wider uppercase transition-colors shrink-0 ${
              activeTab === 'manga'
                ? 'border-[#9e2a2b] bg-[#1a080b] text-[#f2afb2] font-bold'
                : 'border-transparent text-[#7a8899] hover:text-white hover:border-[#1e2938]'
            }`}
          >
            <Clock className="w-4 h-4 text-[#9e2a2b]" />
            <span>MANGA & COUNTDOWN</span>
          </button>

          <button
            onClick={() => setActiveTab('trailers')}
            className={`flex items-center gap-2 px-3.5 py-2 border text-xs font-cinzel tracking-wider uppercase transition-colors shrink-0 ${
              activeTab === 'trailers'
                ? 'border-[#9e2a2b] bg-[#1a080b] text-[#f2afb2] font-bold'
                : 'border-transparent text-[#7a8899] hover:text-white hover:border-[#1e2938]'
            }`}
          >
            <Film className="w-4 h-4 text-[#9e2a2b]" />
            <span>TRAILERS ({trailers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-3.5 py-2 border text-xs font-cinzel tracking-wider uppercase transition-colors shrink-0 ${
              activeTab === 'gallery'
                ? 'border-[#9e2a2b] bg-[#1a080b] text-[#f2afb2] font-bold'
                : 'border-transparent text-[#7a8899] hover:text-white hover:border-[#1e2938]'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#9e2a2b]" />
            <span>GALLERY ({galleryItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`flex items-center gap-2 px-3.5 py-2 border text-xs font-cinzel tracking-wider uppercase transition-colors shrink-0 ${
              activeTab === 'characters'
                ? 'border-[#9e2a2b] bg-[#1a080b] text-[#f2afb2] font-bold'
                : 'border-transparent text-[#7a8899] hover:text-white hover:border-[#1e2938]'
            }`}
          >
            <Users className="w-4 h-4 text-[#9e2a2b]" />
            <span>CHARACTERS ({characters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('regions')}
            className={`flex items-center gap-2 px-3.5 py-2 border text-xs font-cinzel tracking-wider uppercase transition-colors shrink-0 ${
              activeTab === 'regions'
                ? 'border-[#9e2a2b] bg-[#1a080b] text-[#f2afb2] font-bold'
                : 'border-transparent text-[#7a8899] hover:text-white hover:border-[#1e2938]'
            }`}
          >
            <Globe className="w-4 h-4 text-[#9e2a2b]" />
            <span>WORLD REGIONS ({regions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('layout')}
            className={`flex items-center gap-2 px-3.5 py-2 border text-xs font-cinzel tracking-wider uppercase transition-colors shrink-0 ${
              activeTab === 'layout'
                ? 'border-[#9e2a2b] bg-[#1a080b] text-[#f2afb2] font-bold'
                : 'border-transparent text-[#7a8899] hover:text-white hover:border-[#1e2938]'
            }`}
          >
            <Layout className="w-4 h-4 text-[#9e2a2b]" />
            <span>PAGE LAYOUT</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-2 px-3.5 py-2 border text-xs font-cinzel tracking-wider uppercase transition-colors shrink-0 ${
              activeTab === 'appearance'
                ? 'border-[#9e2a2b] bg-[#1a080b] text-[#f2afb2] font-bold'
                : 'border-transparent text-[#7a8899] hover:text-white hover:border-[#1e2938]'
            }`}
          >
            <Palette className="w-4 h-4 text-[#9e2a2b]" />
            <span>ATMOSPHERE & THEME</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3.5 py-2 border text-xs font-cinzel tracking-wider uppercase transition-colors shrink-0 ${
              activeTab === 'settings'
                ? 'border-[#9e2a2b] bg-[#1a080b] text-[#f2afb2] font-bold'
                : 'border-transparent text-[#7a8899] hover:text-white hover:border-[#1e2938]'
            }`}
          >
            <Settings className="w-4 h-4 text-[#9e2a2b]" />
            <span>PORTAL & BRANDING</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {message && (
          <div className="p-4 border border-emerald-800/60 bg-[#06140f] text-emerald-400 text-xs font-editorial-mono flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#9e2a2b] animate-spin mx-auto" />
            <p className="font-editorial-mono text-xs text-[#6e7d90]">
              LOADING CANON ARCHIVE STATE...
            </p>
          </div>
        ) : (
          <>
            {/* ==============================================================
                TAB 1: MANGA & MULTI-COUNTDOWN RELEASES
               ============================================================== */}
            {activeTab === 'manga' && (
              <div className="space-y-6">
                {/* Header & Quick Add */}
                <div className="pb-3 border-b border-[#161d28] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-cinzel text-lg text-white uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#9e2a2b]" />
                      <span>COUNTDOWN TIMERS & BOOK RELEASES ({countdowns.length})</span>
                    </h2>
                    <p className="text-xs font-editorial-mono text-[#6e7d90] mt-1">
                      Manage publication countdowns for new books, manga volumes, light novels, and special premieres.
                    </p>
                  </div>

                  {!editingCountdown && (
                    <button
                      type="button"
                      onClick={() => {
                        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
                        setEditingCountdown({
                          title: 'HAIKAI — VOLUME 02',
                          volumeNumber: `Volume 0${countdowns.length + 1}`,
                          subtitle: 'NEW VOLUME PUBLICATION',
                          category: 'Manga Volume',
                          chapterRange: 'Chapters 06–12',
                          description: 'The journey deepens as the secrets of the First Flood unravel.',
                          coverImage: '/assets/manga_vol_01_cover.webp',
                          releaseAt: nextWeek,
                          mangaUrl: 'https://haikai-manga.official.jp',
                          status: 'Scheduled',
                          openInNewTab: true,
                          isFeatured: false,
                        });
                        setIsNewCountdown(true);
                      }}
                      className="px-4 py-2.5 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs font-cinzel tracking-wider uppercase font-semibold flex items-center gap-2 transition-all shadow-md shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD NEW COUNTDOWN</span>
                    </button>
                  )}
                </div>

                {/* Quick Reschedule Modal */}
                {rescheduleItem && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-lg border border-[#9e2a2b] bg-[#090d14] p-6 space-y-5 shadow-2xl relative">
                      <div className="flex items-center justify-between pb-3 border-b border-[#1b2533]">
                        <h3 className="font-cinzel text-sm text-white uppercase tracking-wider flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#9e2a2b]" />
                          <span>RESCHEDULE COUNTDOWN</span>
                        </h3>
                        <button
                          type="button"
                          onClick={() => setRescheduleItem(null)}
                          className="text-[#64748b] hover:text-white text-xs font-editorial-mono"
                        >
                          ✕ CLOSE
                        </button>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-[#a3b1c2] font-cinzel font-semibold">
                          {rescheduleItem.title}
                        </p>
                        <p className="text-[11px] font-editorial-mono text-[#627183]">
                          Adjust live countdown date & time or toggle immediate reader release.
                        </p>
                      </div>

                      {/* Quick Date Presets */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-editorial-mono text-[#788698] uppercase block">
                          QUICK OFFSET PRESETS:
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { label: '+1 Day', ms: 1 * 24 * 60 * 60 * 1000 },
                            { label: '+3 Days', ms: 3 * 24 * 60 * 60 * 1000 },
                            { label: '+1 Week', ms: 7 * 24 * 60 * 60 * 1000 },
                            { label: '+1 Month', ms: 30 * 24 * 60 * 60 * 1000 },
                          ].map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => {
                                const newDate = new Date(Date.now() + preset.ms).toISOString();
                                setRescheduleItem({ ...rescheduleItem, releaseAt: newDate });
                              }}
                              className="px-2 py-1.5 border border-[#1e2a3b] bg-[#0c121a] hover:border-[#9e2a2b] hover:text-white text-[#8997a8] text-[11px] font-editorial-mono transition-colors"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            TARGET DATE & TIME:
                          </label>
                          <input
                            type="datetime-local"
                            value={
                              rescheduleItem.releaseAt
                                ? new Date(rescheduleItem.releaseAt).toISOString().slice(0, 16)
                                : ''
                            }
                            onChange={(e) => {
                              const iso = new Date(e.target.value).toISOString();
                              setRescheduleItem({ ...rescheduleItem, releaseAt: iso });
                            }}
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3.5 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            COUNTDOWN STATUS:
                          </label>
                          <select
                            value={rescheduleItem.status}
                            onChange={(e) =>
                              setRescheduleItem({
                                ...rescheduleItem,
                                status: e.target.value as 'Scheduled' | 'Released' | 'Hidden',
                              })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3.5 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          >
                            <option value="Scheduled">Scheduled (Active Live Countdown)</option>
                            <option value="Released">Released (Immediate Unsealed Reader Access)</option>
                            <option value="Hidden">Hidden (Draft)</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#161d28] flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setRescheduleItem(null)}
                          className="px-4 py-2 border border-[#232d3d] text-[#8695a7] hover:text-white text-xs font-cinzel uppercase transition-colors"
                        >
                          CANCEL
                        </button>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            handleRescheduleCountdown(
                              rescheduleItem.id,
                              rescheduleItem.releaseAt,
                              rescheduleItem.status
                            )
                          }
                          className="px-5 py-2 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs font-cinzel font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
                        >
                          {saving ? 'UPDATING...' : 'SAVE SCHEDULE'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form: Add or Edit Full Countdown */}
                {editingCountdown && (
                  <div className="border border-[#9e2a2b] bg-[#0a0e16] p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-[#1b2533]">
                      <h3 className="font-cinzel text-base text-white uppercase flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#9e2a2b]" />
                        <span>{isNewCountdown ? 'CREATE NEW COUNTDOWN / BOOK' : 'EDIT COUNTDOWN DETAILS'}</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCountdown(null);
                          setIsNewCountdown(false);
                        }}
                        className="text-xs font-editorial-mono text-[#6c7d92] hover:text-white"
                      >
                        [ CANCEL ]
                      </button>
                    </div>

                    <form onSubmit={handleSaveCountdown} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            RELEASE TITLE:
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. HAIKAI — VOLUME 02"
                            value={editingCountdown.title || ''}
                            onChange={(e) =>
                              setEditingCountdown({ ...editingCountdown, title: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            CATEGORY:
                          </label>
                          <select
                            value={editingCountdown.category || 'Manga Volume'}
                            onChange={(e) =>
                              setEditingCountdown({ ...editingCountdown, category: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          >
                            <option value="Manga Volume">Manga Volume</option>
                            <option value="Book / Light Novel">Book / Light Novel</option>
                            <option value="Anime PV Premiere">Anime PV Premiere</option>
                            <option value="Special Release">Special Release</option>
                            <option value="Merchandise">Merchandise</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            VOLUME NUMBER / BADGE:
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Volume 02, Book I"
                            value={editingCountdown.volumeNumber || ''}
                            onChange={(e) =>
                              setEditingCountdown({ ...editingCountdown, volumeNumber: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            SUBTITLE:
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. THE WHITE SOVEREIGN"
                            value={editingCountdown.subtitle || ''}
                            onChange={(e) =>
                              setEditingCountdown({ ...editingCountdown, subtitle: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            CHAPTER RANGE:
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Chapters 06–12"
                            value={editingCountdown.chapterRange || ''}
                            onChange={(e) =>
                              setEditingCountdown({ ...editingCountdown, chapterRange: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            OFFICIAL READER / PRE-ORDER URL:
                          </label>
                          <input
                            type="url"
                            placeholder="https://..."
                            value={editingCountdown.mangaUrl || ''}
                            onChange={(e) =>
                              setEditingCountdown({ ...editingCountdown, mangaUrl: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            STATUS:
                          </label>
                          <select
                            value={editingCountdown.status || 'Scheduled'}
                            onChange={(e) =>
                              setEditingCountdown({
                                ...editingCountdown,
                                status: e.target.value as 'Scheduled' | 'Released' | 'Hidden',
                              })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          >
                            <option value="Scheduled">Scheduled (Live Countdown Running)</option>
                            <option value="Released">Released (Immediate Unsealed Reader Access)</option>
                            <option value="Hidden">Hidden (Draft)</option>
                          </select>
                        </div>
                      </div>

                      {/* Release Timestamp with quick preset buttons */}
                      <div className="space-y-2 p-4 border border-[#1c2635] bg-[#070a10]">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            SCHEDULED RELEASE TIMESTAMP:
                          </label>
                          <div className="flex items-center gap-1.5 text-[11px] font-editorial-mono text-[#8a99ac]">
                            <span>PRESETS:</span>
                            {[
                              { label: '+24h', ms: 24 * 60 * 60 * 1000 },
                              { label: '+3d', ms: 3 * 24 * 60 * 60 * 1000 },
                              { label: '+7d', ms: 7 * 24 * 60 * 60 * 1000 },
                              { label: '+30d', ms: 30 * 24 * 60 * 60 * 1000 },
                            ].map((p) => (
                              <button
                                key={p.label}
                                type="button"
                                onClick={() => {
                                  const d = new Date(Date.now() + p.ms).toISOString();
                                  setEditingCountdown({ ...editingCountdown, releaseAt: d });
                                }}
                                className="px-2 py-0.5 border border-[#212c3b] bg-[#0b1017] hover:border-[#9e2a2b] hover:text-white"
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <input
                          type="datetime-local"
                          value={
                            editingCountdown.releaseAt
                              ? new Date(editingCountdown.releaseAt).toISOString().slice(0, 16)
                              : ''
                          }
                          onChange={(e) => {
                            const iso = new Date(e.target.value).toISOString();
                            setEditingCountdown({ ...editingCountdown, releaseAt: iso });
                          }}
                          className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                        />
                      </div>

                      {/* Featured on Home toggle */}
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-editorial-mono text-[#a3b1c2]">
                        <input
                          type="checkbox"
                          checked={Boolean(editingCountdown.isFeatured)}
                          onChange={(e) =>
                            setEditingCountdown({ ...editingCountdown, isFeatured: e.target.checked })
                          }
                          className="accent-[#9e2a2b] w-4 h-4"
                        />
                        <span>Feature this countdown as primary showcase on homepage & hero</span>
                      </label>

                      <div className="space-y-1">
                        <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                          SYNOPSIS & DESCRIPTION:
                        </label>
                        <textarea
                          rows={3}
                          value={editingCountdown.description || ''}
                          onChange={(e) =>
                            setEditingCountdown({ ...editingCountdown, description: e.target.value })
                          }
                          className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                        />
                      </div>

                      {/* Volume Cover with Crop */}
                      <div className="space-y-2 pt-2 border-t border-[#161d28]">
                        <ImageInputWithCrop
                          label="VOLUME / BOOK COVER ARTWORK (3:4 RATIO)"
                          value={editingCountdown.coverImage}
                          aspectRatioPreset="3:4"
                          onChange={(newUrl: string) => {
                            setEditingCountdown({ ...editingCountdown, coverImage: newUrl });
                          }}
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="submit"
                          disabled={saving}
                          className="px-8 py-3 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs font-cinzel tracking-widest uppercase font-semibold border border-[#9e2a2b] transition-all disabled:opacity-50"
                        >
                          {saving ? '[ SAVING... ]' : '[ SAVE COUNTDOWN ]'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCountdown(null);
                            setIsNewCountdown(false);
                          }}
                          className="px-6 py-3 border border-[#222d3b] text-[#78889b] hover:text-white text-xs font-cinzel tracking-wider uppercase transition-colors"
                        >
                          [ CANCEL ]
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* List of All Countdowns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {countdowns.map((item) => {
                    const releaseDate = new Date(item.releaseAt);
                    const isPassed = Date.now() >= releaseDate.getTime();
                    const isReleased = item.status === 'Released' || isPassed;

                    return (
                      <div
                        key={item.id}
                        className={`border p-5 bg-[#070b10] flex flex-col justify-between space-y-4 relative transition-all ${
                          item.isFeatured
                            ? 'border-[#9e2a2b] shadow-[0_0_20px_rgba(158,42,43,0.2)]'
                            : 'border-[#1b2432] hover:border-[#2f3d52]'
                        }`}
                      >
                        {/* Top Meta info */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            {/* Thumbnail */}
                            <div className="w-14 h-18 sm:w-16 sm:h-20 aspect-[3/4] bg-[#0c1219] border border-[#202c3c] overflow-hidden shrink-0">
                              {item.coverImage ? (
                                <img
                                  src={item.coverImage}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-[#4d5c6f] font-editorial-mono">
                                  COVER
                                </div>
                              )}
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2 py-0.5 bg-[#1b232e] text-[#f2afb2] text-[10px] font-editorial-mono uppercase tracking-wider">
                                  {item.volumeNumber || 'RELEASE'}
                                </span>
                                {item.category && (
                                  <span className="text-[10px] font-editorial-mono text-[#8997a8] border border-[#1b2432] px-1.5 py-0.5">
                                    {item.category}
                                  </span>
                                )}
                                {item.isFeatured && (
                                  <span className="flex items-center gap-1 text-[10px] font-editorial-mono text-amber-400 bg-amber-950/40 border border-amber-800/60 px-1.5 py-0.5">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    <span>FEATURED ON HOME</span>
                                  </span>
                                )}
                              </div>

                              <h3 className="font-cinzel text-sm sm:text-base text-white font-semibold leading-snug">
                                {item.title}
                              </h3>
                              {item.subtitle && (
                                <p className="text-[11px] font-editorial-mono text-[#6c7d91]">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span
                              className={`text-[10px] font-editorial-mono uppercase px-2 py-0.5 border block ${
                                item.status === 'Released' || isPassed
                                  ? 'border-emerald-800 bg-emerald-950/40 text-emerald-400'
                                  : item.status === 'Hidden'
                                  ? 'border-[#333] bg-[#111] text-[#777]'
                                  : 'border-[#9e2a2b] bg-[#220a0d] text-[#f2afb2]'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                        </div>

                        {/* Release schedule indicator */}
                        <div className="p-2.5 bg-[#05080c] border border-[#141c28] text-xs font-editorial-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-[#8695a7]">
                            <Calendar className="w-3.5 h-3.5 text-[#9e2a2b]" />
                            <span>
                              {new Date(item.releaseAt).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          <span className={`text-[11px] ${isReleased ? 'text-emerald-400 font-bold' : 'text-[#f2afb2]'}`}>
                            {isReleased ? '✓ PUBLISHED / UNLOCKED' : '⏳ COUNTDOWN ACTIVE'}
                          </span>
                        </div>

                        {/* Actions Toolbar */}
                        <div className="pt-2 border-t border-[#131b26] flex items-center justify-between gap-1 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Reschedule Button */}
                            <button
                              type="button"
                              onClick={() =>
                                setRescheduleItem({
                                  id: item.id,
                                  title: `${item.title} (${item.volumeNumber || ''})`,
                                  releaseAt: item.releaseAt,
                                  status: item.status,
                                })
                              }
                              className="px-2.5 py-1.5 border border-[#232f41] hover:border-[#9e2a2b] text-[11px] font-editorial-mono text-[#8a99ac] hover:text-white flex items-center gap-1 transition-colors"
                              title="Reschedule countdown release time"
                            >
                              <Calendar className="w-3 h-3 text-[#9e2a2b]" />
                              <span>RESCHEDULE</span>
                            </button>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCountdown({ ...item });
                                setIsNewCountdown(false);
                              }}
                              className="px-2.5 py-1.5 border border-[#232f41] hover:border-white text-[11px] font-editorial-mono text-[#8a99ac] hover:text-white flex items-center gap-1 transition-colors"
                              title="Edit all volume and release details"
                            >
                              <Edit className="w-3 h-3" />
                              <span>EDIT</span>
                            </button>

                            {/* Feature on Home */}
                            {!item.isFeatured && (
                              <button
                                type="button"
                                onClick={() => handleFeatureCountdown(item.id)}
                                className="px-2.5 py-1.5 border border-[#232f41] hover:border-amber-500 text-[11px] font-editorial-mono text-[#8a99ac] hover:text-amber-300 flex items-center gap-1 transition-colors"
                                title="Set as featured hero countdown on public site"
                              >
                                <Star className="w-3 h-3" />
                                <span>FEATURE</span>
                              </button>
                            )}

                            {/* Immediate Release */}
                            {item.status !== 'Released' && (
                              <button
                                type="button"
                                onClick={() => handlePublishCountdownNow(item.id)}
                                className="px-2.5 py-1.5 border border-emerald-900/80 bg-emerald-950/20 hover:bg-emerald-900/40 text-[11px] font-editorial-mono text-emerald-400 flex items-center gap-1 transition-colors"
                                title="Force release reader immediately"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>RELEASE NOW</span>
                              </button>
                            )}
                          </div>

                          {/* Delete Countdown (Allowed if > 1 countdown) */}
                          {countdowns.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteCountdown(item.id)}
                              className="p-1.5 text-[#5e6c7d] hover:text-rose-400 hover:bg-rose-950/30 transition-colors ml-auto"
                              title="Delete this countdown"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ==============================================================
                TAB 2: TRAILERS & PVS
               ============================================================== */}
            {activeTab === 'trailers' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#1b2533]">
                  <h2 className="font-cinzel text-lg text-white uppercase tracking-wider flex items-center gap-2">
                    <Film className="w-4 h-4 text-[#9e2a2b]" />
                    <span>CANON TRAILERS & PROMOTIONAL VIDEOS</span>
                  </h2>

                  {!editingTrailer && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTrailer({
                          title: '',
                          japanese: '',
                          videoUrl: '',
                          duration: '01:30',
                          category: 'Official PV',
                          description: '',
                          status: 'Published',
                        });
                        setIsNewTrailer(true);
                      }}
                      className="px-4 py-2 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs font-cinzel tracking-wider uppercase font-semibold flex items-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD TRAILER</span>
                    </button>
                  )}
                </div>

                {editingTrailer && (
                  <div className="border border-[#9e2a2b]/60 bg-[#0d090d] p-6 space-y-4">
                    <h3 className="font-cinzel text-base text-white uppercase">
                      {isNewTrailer ? 'NEW TRAILER ENTRY' : 'EDIT TRAILER ENTRY'}
                    </h3>

                    <form onSubmit={handleSaveTrailer} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            TRAILER TITLE:
                          </label>
                          <input
                            type="text"
                            required
                            value={editingTrailer.title || ''}
                            onChange={(e) =>
                              setEditingTrailer({ ...editingTrailer, title: e.target.value })
                            }
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
                            onChange={(e) =>
                              setEditingTrailer({ ...editingTrailer, japanese: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                          VIDEO STREAM URL (YOUTUBE, VIMEO, OR DIRECT MP4):
                        </label>
                        <input
                          type="url"
                          required
                          value={editingTrailer.videoUrl || ''}
                          onChange={(e) =>
                            setEditingTrailer({ ...editingTrailer, videoUrl: e.target.value })
                          }
                          className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            CATEGORY:
                          </label>
                          <select
                            value={editingTrailer.category || 'Official Teaser'}
                            onChange={(e) =>
                              setEditingTrailer({ ...editingTrailer, category: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          >
                            <option value="Official Teaser">Official Teaser</option>
                            <option value="Main Trailer">Main Trailer</option>
                            <option value="Character PV">Character PV</option>
                            <option value="Cinematic Short">Cinematic Short</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            DURATION:
                          </label>
                          <input
                            type="text"
                            value={editingTrailer.duration || ''}
                            onChange={(e) =>
                              setEditingTrailer({ ...editingTrailer, duration: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                            placeholder="01:30"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            STATUS:
                          </label>
                          <select
                            value={editingTrailer.status || 'Published'}
                            onChange={(e) =>
                              setEditingTrailer({
                                ...editingTrailer,
                                status: e.target.value as 'Published' | 'Draft' | 'Hidden',
                              })
                            }
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
                          DESCRIPTION & SYNOPSIS:
                        </label>
                        <textarea
                          rows={2}
                          value={editingTrailer.description || ''}
                          onChange={(e) =>
                            setEditingTrailer({ ...editingTrailer, description: e.target.value })
                          }
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
                          <span>{saving ? 'SAVING...' : 'SAVE TRAILER'}</span>
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

                {/* Trailers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trailers.map((t) => (
                    <div
                      key={t.id}
                      className="border border-[#1a2533] bg-[#070b10] flex flex-col justify-between overflow-hidden"
                    >
                      <div className="aspect-video w-full bg-[#0d131c] flex items-center justify-center relative group">
                        <Play className="w-10 h-10 text-[#9e2a2b]" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-[10px] font-editorial-mono text-[#f2afb2]">
                          {t.category || 'TRAILER'}
                        </span>
                        {t.duration && (
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-[10px] font-editorial-mono text-[#c4ccd6]">
                            {t.duration}
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-2">
                        <span className="text-[10px] font-jp text-[#6b7b8d] block">{t.japanese}</span>
                        <h4 className="font-cinzel text-sm text-[#edf1f5] uppercase truncate font-semibold">
                          {t.title}
                        </h4>
                        <p className="text-xs text-[#718090] line-clamp-2">{t.description}</p>

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
                              className="px-2 py-1 border border-[#2b394d] bg-[#0c121b] text-white hover:border-[#9e2a2b] text-[11px]"
                            >
                              EDIT
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTrailer(t.id)}
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
                TAB 3: GALLERY ARTWORKS
               ============================================================== */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#1b2533]">
                  <h2 className="font-cinzel text-lg text-white uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#9e2a2b]" />
                    <span>CANON KEY ART & VISUAL CHRONICLE</span>
                  </h2>

                  {!editingGallery && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingGallery({
                          title: '',
                          japanese: '',
                          category: 'CHARACTERS',
                          description: '',
                          status: 'Published',
                          aspectRatio: '16:9',
                        });
                        setIsNewGallery(true);
                      }}
                      className="px-4 py-2 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs font-cinzel tracking-wider uppercase font-semibold flex items-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD ARTWORK</span>
                    </button>
                  )}
                </div>

                {editingGallery && (
                  <div className="border border-[#9e2a2b]/60 bg-[#0d090d] p-6 space-y-4">
                    <h3 className="font-cinzel text-base text-white uppercase">
                      {isNewGallery ? 'NEW GALLERY ARTWORK' : 'EDIT GALLERY ARTWORK'}
                    </h3>

                    <form onSubmit={handleSaveGallery} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            ARTWORK TITLE:
                          </label>
                          <input
                            type="text"
                            required
                            value={editingGallery.title || ''}
                            onChange={(e) =>
                              setEditingGallery({ ...editingGallery, title: e.target.value })
                            }
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
                            onChange={(e) =>
                              setEditingGallery({ ...editingGallery, japanese: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <ImageInputWithCrop
                          label="KEY ART IMAGE ASSET (16:9 RATIO)"
                          value={editingGallery.imageUrl || ''}
                          aspectRatioPreset="16:9"
                          onChange={(newUrl: string) => {
                            setEditingGallery({ ...editingGallery, imageUrl: newUrl });
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            CATEGORY:
                          </label>
                          <select
                            value={editingGallery.category || 'CHARACTERS'}
                            onChange={(e) =>
                              setEditingGallery({ ...editingGallery, category: e.target.value })
                            }
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
                            STATUS:
                          </label>
                          <select
                            value={editingGallery.status || 'Published'}
                            onChange={(e) =>
                              setEditingGallery({
                                ...editingGallery,
                                status: e.target.value as 'Published' | 'Draft' | 'Hidden',
                              })
                            }
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
                          onChange={(e) =>
                            setEditingGallery({ ...editingGallery, description: e.target.value })
                          }
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
                        <p className="text-xs text-[#718090] line-clamp-2">{item.description}</p>

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
                TAB 4: CHARACTERS DOSSIER MANAGER (NEW)
               ============================================================== */}
            {activeTab === 'characters' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#1b2533]">
                  <div>
                    <h2 className="font-cinzel text-lg text-white uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#9e2a2b]" />
                      <span>CANON CHARACTER DOSSIERS</span>
                    </h2>
                    <p className="text-xs text-[#6e7d90]">
                      Add, edit, or curate protagonist and antagonist lore dossiers.
                    </p>
                  </div>

                  {!editingCharacter && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCharacter({
                          name: '',
                          japanese: '',
                          age: '17',
                          role: 'Salvage Diver',
                          origin: 'Iron Archipelago',
                          quote: '',
                          highlight: '',
                          appearance: '',
                          description: '',
                          knownFor: [],
                          classifiedNote: '',
                          status: 'Published',
                        });
                        setIsNewCharacter(true);
                      }}
                      className="px-4 py-2 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs font-cinzel tracking-wider uppercase font-semibold flex items-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD CHARACTER</span>
                    </button>
                  )}
                </div>

                {editingCharacter && (
                  <div className="border border-[#9e2a2b]/60 bg-[#0d090d] p-6 space-y-4">
                    <h3 className="font-cinzel text-base text-white uppercase">
                      {isNewCharacter ? 'NEW CHARACTER DOSSIER' : 'EDIT CHARACTER DOSSIER'}
                    </h3>

                    <form onSubmit={handleSaveCharacter} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            CHARACTER NAME:
                          </label>
                          <input
                            type="text"
                            required
                            value={editingCharacter.name || ''}
                            onChange={(e) =>
                              setEditingCharacter({ ...editingCharacter, name: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            JAPANESE KANJI:
                          </label>
                          <input
                            type="text"
                            value={editingCharacter.japanese || ''}
                            onChange={(e) =>
                              setEditingCharacter({ ...editingCharacter, japanese: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            ROLE / TITLE:
                          </label>
                          <input
                            type="text"
                            value={editingCharacter.role || ''}
                            onChange={(e) =>
                              setEditingCharacter({ ...editingCharacter, role: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            AGE:
                          </label>
                          <input
                            type="text"
                            value={editingCharacter.age || ''}
                            onChange={(e) =>
                              setEditingCharacter({ ...editingCharacter, age: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            ORIGIN / REGION:
                          </label>
                          <input
                            type="text"
                            value={editingCharacter.origin || ''}
                            onChange={(e) =>
                              setEditingCharacter({ ...editingCharacter, origin: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            STATUS:
                          </label>
                          <select
                            value={editingCharacter.status || 'Published'}
                            onChange={(e) =>
                              setEditingCharacter({
                                ...editingCharacter,
                                status: e.target.value as 'Published' | 'Draft' | 'Hidden',
                              })
                            }
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
                          SIGNATURE QUOTE:
                        </label>
                        <input
                          type="text"
                          value={editingCharacter.quote || ''}
                          onChange={(e) =>
                            setEditingCharacter({ ...editingCharacter, quote: e.target.value })
                          }
                          className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                          HIGHLIGHT TRAIT / ONE-LINER:
                        </label>
                        <input
                          type="text"
                          value={editingCharacter.highlight || ''}
                          onChange={(e) =>
                            setEditingCharacter({ ...editingCharacter, highlight: e.target.value })
                          }
                          className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                          BIOGRAPHY & CHARACTER DESCRIPTION:
                        </label>
                        <textarea
                          rows={3}
                          value={editingCharacter.description || ''}
                          onChange={(e) =>
                            setEditingCharacter({ ...editingCharacter, description: e.target.value })
                          }
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
                          <span>{saving ? 'SAVING...' : 'SAVE DOSSIER'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCharacter(null);
                            setIsNewCharacter(false);
                          }}
                          className="px-4 py-2 border border-[#232f3f] text-xs font-editorial-mono text-[#7a8999] hover:text-white"
                        >
                          CANCEL
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Character List Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {characters.map((char) => (
                    <div
                      key={char.id}
                      className="border border-[#1a2533] bg-[#070b10] p-5 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-editorial-mono px-2 py-0.5 border border-[#232f3f] bg-[#0c121a] text-[#f2afb2]">
                            {char.role}
                          </span>
                          <span className="font-jp text-sm text-[#6d7c8e]">{char.japanese}</span>
                        </div>
                        <h4 className="font-cinzel text-base text-[#edf1f5] uppercase font-bold">
                          {char.name}
                        </h4>
                        <p className="text-xs text-[#718090] line-clamp-2 italic font-serif-cinematic">
                          {char.quote || char.highlight}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#131b26] flex items-center justify-between text-xs font-editorial-mono">
                        <span className={char.status === 'Published' ? 'text-emerald-400' : 'text-[#7e8d9e]'}>
                          ● {char.status || 'Published'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCharacter(char);
                              setIsNewCharacter(false);
                            }}
                            className="px-2 py-1 border border-[#2b394d] bg-[#0c121b] text-white hover:border-[#9e2a2b] text-[11px]"
                          >
                            EDIT
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCharacter(char.id)}
                            className="px-2 py-1 border border-[#4a181b] bg-[#16070a] text-[#f2afb2] hover:bg-[#250b10] text-[11px]"
                          >
                            DELETE
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==============================================================
                TAB 5: WORLD REGIONS LORE (NEW)
               ============================================================== */}
            {activeTab === 'regions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#1b2533]">
                  <div>
                    <h2 className="font-cinzel text-lg text-white uppercase tracking-wider flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#9e2a2b]" />
                      <span>THE FIVE WORLD REGIONS</span>
                    </h2>
                    <p className="text-xs text-[#6e7d90]">
                      Customize region territories, government systems, hazards, and depth records.
                    </p>
                  </div>

                  {!editingRegion && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRegion({
                          name: '',
                          japanese: '',
                          number: `REGION 0${regions.length + 1}`,
                          tagline: '',
                          visualSummary: '',
                          government: 'Admiralty Council',
                          powerSource: 'Ash Furnaces',
                          ideology: 'Basin Hegemony',
                          depthRecord: '0m',
                          description: '',
                          hazards: [],
                          keyLocations: [],
                          status: 'Published',
                        });
                        setIsNewRegion(true);
                      }}
                      className="px-4 py-2 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs font-cinzel tracking-wider uppercase font-semibold flex items-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD REGION</span>
                    </button>
                  )}
                </div>

                {editingRegion && (
                  <div className="border border-[#9e2a2b]/60 bg-[#0d090d] p-6 space-y-4">
                    <h3 className="font-cinzel text-base text-white uppercase">
                      {isNewRegion ? 'NEW WORLD REGION' : 'EDIT WORLD REGION'}
                    </h3>

                    <form onSubmit={handleSaveRegion} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            REGION NAME:
                          </label>
                          <input
                            type="text"
                            required
                            value={editingRegion.name || ''}
                            onChange={(e) =>
                              setEditingRegion({ ...editingRegion, name: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            JAPANESE NAME:
                          </label>
                          <input
                            type="text"
                            value={editingRegion.japanese || ''}
                            onChange={(e) =>
                              setEditingRegion({ ...editingRegion, japanese: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            CODE / NUMBER:
                          </label>
                          <input
                            type="text"
                            value={editingRegion.number || ''}
                            onChange={(e) =>
                              setEditingRegion({ ...editingRegion, number: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            GOVERNMENT:
                          </label>
                          <input
                            type="text"
                            value={editingRegion.government || ''}
                            onChange={(e) =>
                              setEditingRegion({ ...editingRegion, government: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            POWER SOURCE:
                          </label>
                          <input
                            type="text"
                            value={editingRegion.powerSource || ''}
                            onChange={(e) =>
                              setEditingRegion({ ...editingRegion, powerSource: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                            DEPTH RECORD:
                          </label>
                          <input
                            type="text"
                            value={editingRegion.depthRecord || ''}
                            onChange={(e) =>
                              setEditingRegion({ ...editingRegion, depthRecord: e.target.value })
                            }
                            className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                          TAGLINE / MOTTO:
                        </label>
                        <input
                          type="text"
                          value={editingRegion.tagline || ''}
                          onChange={(e) =>
                            setEditingRegion({ ...editingRegion, tagline: e.target.value })
                          }
                          className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                          LORE DESCRIPTION:
                        </label>
                        <textarea
                          rows={3}
                          value={editingRegion.description || ''}
                          onChange={(e) =>
                            setEditingRegion({ ...editingRegion, description: e.target.value })
                          }
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
                          <span>{saving ? 'SAVING...' : 'SAVE REGION'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingRegion(null);
                            setIsNewRegion(false);
                          }}
                          className="px-4 py-2 border border-[#232f3f] text-xs font-editorial-mono text-[#7a8999] hover:text-white"
                        >
                          CANCEL
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regions.map((reg) => (
                    <div
                      key={reg.id}
                      className="border border-[#1a2533] bg-[#070b10] p-5 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-editorial-mono text-[#9e2a2b]">
                            {reg.number}
                          </span>
                          <span className="font-jp text-sm text-[#6d7c8e]">{reg.japanese}</span>
                        </div>
                        <h4 className="font-cinzel text-base text-[#edf1f5] uppercase font-bold">
                          {reg.name}
                        </h4>
                        <p className="text-xs text-[#718090] line-clamp-2">{reg.tagline || reg.description}</p>
                      </div>

                      <div className="pt-3 border-t border-[#131b26] flex items-center justify-between text-xs font-editorial-mono">
                        <span className="text-[#8e9dae]">{reg.depthRecord || 'Basin Level'}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingRegion(reg);
                              setIsNewRegion(false);
                            }}
                            className="px-2 py-1 border border-[#2b394d] bg-[#0c121b] text-white hover:border-[#9e2a2b] text-[11px]"
                          >
                            EDIT
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRegion(reg.id)}
                            className="px-2 py-1 border border-[#4a181b] bg-[#16070a] text-[#f2afb2] hover:bg-[#250b10] text-[11px]"
                          >
                            DELETE
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==============================================================
                TAB 6: PAGE LAYOUT & SECTION VISIBILITY (NEW)
               ============================================================== */}
            {activeTab === 'layout' && settings && (
              <div className="border border-[#1f2837] bg-[#080c12] p-6 sm:p-8 space-y-6">
                <div className="pb-3 border-b border-[#161d28] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-cinzel text-lg text-white uppercase tracking-wider flex items-center gap-2">
                      <Layout className="w-4 h-4 text-[#9e2a2b]" />
                      <span>LANDING PAGE SECTION VISIBILITY</span>
                    </h2>
                    <p className="text-xs text-[#6e7d90]">
                      Toggle any section ON or OFF to customize the landing page flow.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAllSections(true)}
                      className="px-3 py-1.5 border border-[#263548] text-xs font-editorial-mono text-[#cbd6e2] hover:border-[#9e2a2b] transition-colors"
                    >
                      ENABLE ALL
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!settings) return;
                        setSettings({
                          ...settings,
                          visibleSections: {
                            introduction: true,
                            seaOfAsh: false,
                            world: true,
                            characters: true,
                            ashSection: false,
                            relationships: false,
                            romance: false,
                            oathSystem: false,
                            storyArcs: false,
                            mysteries: false,
                            manga: true,
                            warRecords: false,
                            trailers: true,
                            gallery: true,
                            finalQuestion: true,
                          },
                        });
                      }}
                      className="px-3 py-1.5 border border-[#263548] text-xs font-editorial-mono text-[#cbd6e2] hover:border-[#9e2a2b] transition-colors"
                    >
                      MINIMAL PRESET
                    </button>
                  </div>
                </div>

                {/* Section Toggle Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {[
                    { key: 'introduction' as const, label: 'The First Flood', sub: 'Origins & Historical Disaster' },
                    { key: 'seaOfAsh' as const, label: 'The Sea of Ash', sub: 'Three Inviolable Basin Rules' },
                    { key: 'world' as const, label: 'World Regions', sub: 'Five Territories & Citadel Lore' },
                    { key: 'characters' as const, label: 'Character Dossiers', sub: 'Nero, Eira, Antiquarians' },
                    { key: 'ashSection' as const, label: 'Ash Mutations', sub: 'Miracles vs Blackened Flesh' },
                    { key: 'relationships' as const, label: 'Relationship Graph', sub: 'Network Matrix of Loyalties' },
                    { key: 'romance' as const, label: 'Forbidden Romance', sub: 'Things Never Said in Words' },
                    { key: 'oathSystem' as const, label: 'The Oath System', sub: 'Price of Sacrificial Power' },
                    { key: 'storyArcs' as const, label: 'Story Arc Timeline', sub: 'The Descent into 82° South' },
                    { key: 'mysteries' as const, label: 'Mystery Archive', sub: 'Classified Pre-Flood Files' },
                    { key: 'manga' as const, label: 'Manga Serialization', sub: 'Volume 01 Countdown & Reader' },
                    { key: 'warRecords' as const, label: 'War Records', sub: 'Censorship & Historical Fragments' },
                    { key: 'trailers' as const, label: 'Official Trailers', sub: 'Cinematic PVs & Teasers' },
                    { key: 'gallery' as const, label: 'Visual Gallery', sub: 'Key Art & Lightbox Chronicle' },
                    { key: 'finalQuestion' as const, label: 'Final Question', sub: 'The Ultimate Divergence Choice' },
                  ].map((sec) => {
                    const isVisible = settings.visibleSections?.[sec.key] !== false;
                    return (
                      <div
                        key={sec.key}
                        onClick={() => updateSectionVisibility(sec.key, !isVisible)}
                        className={`p-4 border transition-all cursor-pointer flex items-center justify-between select-none ${
                          isVisible
                            ? 'border-[#9e2a2b]/60 bg-[#14080a]/50 text-white'
                            : 'border-[#1b232e] bg-[#06090d]/60 text-[#647182] hover:border-[#2b394d]'
                        }`}
                      >
                        <div>
                          <h4 className="font-cinzel text-xs uppercase font-bold tracking-wider">
                            {sec.label}
                          </h4>
                          <span className="text-[11px] font-editorial-mono text-[#8b99aa] block">
                            {sec.sub}
                          </span>
                        </div>

                        <span
                          className={`px-2 py-0.5 text-[10px] font-editorial-mono font-bold tracking-wider border ${
                            isVisible
                              ? 'border-emerald-700 bg-emerald-950/80 text-emerald-400'
                              : 'border-[#2d394a] bg-[#0c1219] text-[#718090]'
                          }`}
                        >
                          {isVisible ? 'ON' : 'OFF'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-[#161d28]">
                  <button
                    type="button"
                    onClick={() => handleSaveSettings()}
                    disabled={saving}
                    className="w-full sm:w-auto px-8 py-3 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs font-cinzel tracking-widest uppercase font-semibold border border-[#9e2a2b] transition-all disabled:opacity-50"
                  >
                    {saving ? '[ SAVING... ]' : '[ SAVE PAGE LAYOUT ]'}
                  </button>
                </div>
              </div>
            )}

            {/* ==============================================================
                TAB 7: ATMOSPHERE & THEME CUSTOMIZER (NEW)
               ============================================================== */}
            {activeTab === 'appearance' && settings && (
              <div className="border border-[#1f2837] bg-[#080c12] p-6 sm:p-8 space-y-6">
                <div className="pb-3 border-b border-[#161d28]">
                  <h2 className="font-cinzel text-lg text-white uppercase tracking-wider flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#9e2a2b]" />
                    <span>VISUAL ATMOSPHERE, ACCENTS & ANIMATION</span>
                  </h2>
                  <p className="text-xs text-[#6e7d90]">
                    Customize site accent colors, floating ash embers, announcement banners, and animations.
                  </p>
                </div>

                {/* Primary Accent Color */}
                <div className="space-y-3">
                  <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                    PRIMARY ACCENT COLOR PALETTE:
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {colorPresets.map((cp) => (
                      <button
                        key={cp.hex}
                        type="button"
                        onClick={() => setSettings({ ...settings, accentColor: cp.hex })}
                        className={`flex items-center gap-2 px-3 py-2 border text-xs font-editorial-mono transition-all ${
                          settings.accentColor === cp.hex
                            ? 'border-white bg-[#1a080b] text-white shadow-lg'
                            : 'border-[#1f2837] bg-[#070b10] text-[#8695a7] hover:border-[#38495f]'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/30"
                          style={{ backgroundColor: cp.hex }}
                        />
                        <span>{cp.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-xs font-editorial-mono text-[#7a8899]">CUSTOM HEX:</span>
                    <input
                      type="text"
                      value={settings.accentColor || '#9e2a2b'}
                      onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                      className="w-32 bg-[#05070a] border border-[#1b2533] px-3 py-1.5 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                    />
                    <input
                      type="color"
                      value={settings.accentColor?.startsWith('#') ? settings.accentColor : '#9e2a2b'}
                      onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                      className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>

                {/* Ash Particle Drift */}
                <div className="pt-4 border-t border-[#161d28] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cinzel text-sm text-white uppercase font-bold">
                        FLOATING ASH & EMBER DRIFT EFFECT
                      </h4>
                      <p className="text-xs text-[#6e7d90]">
                        Renders ambient floating embers drifting gently across the dark background.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSettings({
                          ...settings,
                          showAshParticles: settings.showAshParticles === false ? true : false,
                        })
                      }
                      className={`px-4 py-2 border text-xs font-editorial-mono transition-all ${
                        settings.showAshParticles !== false
                          ? 'border-emerald-700 bg-emerald-950/70 text-emerald-400 font-bold'
                          : 'border-[#293648] bg-[#0c1219] text-[#718090]'
                      }`}
                    >
                      {settings.showAshParticles !== false ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                </div>

                {/* Top Announcement Banner (Defaults to OFF - removing 'PRE-FLOOD RECKONING') */}
                <div className="pt-4 border-t border-[#161d28] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cinzel text-sm text-white uppercase font-bold">
                        TOP ANNOUNCEMENT / HERO NOTICE BANNER
                      </h4>
                      <p className="text-xs text-[#6e7d90]">
                        Shows a discreet official announcement badge directly above the main title.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSettings({
                          ...settings,
                          showHeroNotice: !settings.showHeroNotice,
                        })
                      }
                      className={`px-4 py-2 border text-xs font-editorial-mono transition-all ${
                        settings.showHeroNotice
                          ? 'border-emerald-700 bg-emerald-950/70 text-emerald-400 font-bold'
                          : 'border-[#293648] bg-[#0c1219] text-[#718090]'
                      }`}
                    >
                      {settings.showHeroNotice ? 'VISIBLE' : 'HIDDEN (OFF)'}
                    </button>
                  </div>

                  {settings.showHeroNotice && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                          ANNOUNCEMENT TEXT:
                        </label>
                        <input
                          type="text"
                          value={settings.heroNotice || ''}
                          onChange={(e) => setSettings({ ...settings, heroNotice: e.target.value })}
                          className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          placeholder="e.g. OFFICIAL ANIME ADAPTATION ANNOUNCED"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                          ANNOUNCEMENT TARGET URL (OPTIONAL):
                        </label>
                        <input
                          type="text"
                          value={settings.heroNoticeLink || ''}
                          onChange={(e) =>
                            setSettings({ ...settings, heroNoticeLink: e.target.value })
                          }
                          className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                          placeholder="#manga or https://..."
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#161d28]">
                  <button
                    type="button"
                    onClick={() => handleSaveSettings()}
                    disabled={saving}
                    className="w-full sm:w-auto px-8 py-3 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs font-cinzel tracking-widest uppercase font-semibold border border-[#9e2a2b] transition-all disabled:opacity-50"
                  >
                    {saving ? '[ SAVING... ]' : '[ SAVE THEME & ATMOSPHERE ]'}
                  </button>
                </div>
              </div>
            )}

            {/* ==============================================================
                TAB 8: PORTAL METADATA & BRANDING
               ============================================================== */}
            {activeTab === 'settings' && settings && (
              <div className="border border-[#1f2837] bg-[#080c12] p-6 sm:p-8 space-y-6">
                <div className="pb-3 border-b border-[#161d28]">
                  <h2 className="font-cinzel text-lg text-white uppercase tracking-wider flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#9e2a2b]" />
                    <span>PORTAL METADATA & CANON BRANDING</span>
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
                        JAPANESE TITLE (KANJI):
                      </label>
                      <input
                        type="text"
                        value={settings.japaneseTitle}
                        onChange={(e) =>
                          setSettings({ ...settings, japaneseTitle: e.target.value })
                        }
                        className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                      CENTRAL TAGLINE QUOTE:
                    </label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                        PRIMARY CTA BUTTON LABEL:
                      </label>
                      <input
                        type="text"
                        value={settings.ctaPrimaryLabel || '[ ENTER THE WORLD → ]'}
                        onChange={(e) =>
                          setSettings({ ...settings, ctaPrimaryLabel: e.target.value })
                        }
                        className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                        PRIMARY CTA DESTINATION LINK:
                      </label>
                      <input
                        type="text"
                        value={settings.ctaPrimaryLink || '#manga'}
                        onChange={(e) =>
                          setSettings({ ...settings, ctaPrimaryLink: e.target.value })
                        }
                        className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                        placeholder="#manga or https://..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                        SECONDARY CTA BUTTON LABEL:
                      </label>
                      <input
                        type="text"
                        value={settings.ctaSecondaryLabel || '[ MEET THE CHARACTERS ]'}
                        onChange={(e) =>
                          setSettings({ ...settings, ctaSecondaryLabel: e.target.value })
                        }
                        className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                        SECONDARY CTA DESTINATION LINK:
                      </label>
                      <input
                        type="text"
                        value={settings.ctaSecondaryLink || '#characters'}
                        onChange={(e) =>
                          setSettings({ ...settings, ctaSecondaryLink: e.target.value })
                        }
                        className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-2 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                        placeholder="#characters"
                      />
                    </div>
                  </div>

                  {/* Social links */}
                  <div className="pt-3 border-t border-[#161d28] space-y-3">
                    <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                      OFFICIAL SOCIAL MEDIA LINKS:
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-editorial-mono text-[#5f6f82] block">
                          X (TWITTER):
                        </span>
                        <input
                          type="url"
                          value={settings.socialLinks?.x || ''}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              socialLinks: { ...settings.socialLinks, x: e.target.value },
                            })
                          }
                          className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-1.5 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-editorial-mono text-[#5f6f82] block">
                          DISCORD SERVER:
                        </span>
                        <input
                          type="url"
                          value={settings.socialLinks?.discord || ''}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              socialLinks: { ...settings.socialLinks, discord: e.target.value },
                            })
                          }
                          className="w-full bg-[#05070a] border border-[#1b2533] px-3 py-1.5 text-xs font-editorial-mono text-white outline-none focus:border-[#9e2a2b]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-editorial-mono text-[#788698] uppercase block">
                      SEO DESCRIPTION:
                    </label>
                    <textarea
                      rows={2}
                      value={settings.seoDescription}
                      onChange={(e) =>
                        setSettings({ ...settings, seoDescription: e.target.value })
                      }
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
