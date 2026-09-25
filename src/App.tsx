import React, { useState, useEffect, useCallback } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Introduction } from './components/Introduction';
import { SeaOfAsh } from './components/SeaOfAsh';
import { AshSection } from './components/AshSection';
import { WorldSection } from './components/WorldSection';
import { CharactersSection } from './components/CharactersSection';
import { RelationshipGraph } from './components/RelationshipGraph';
import { RomanceSection } from './components/RomanceSection';
import { OathSystem } from './components/OathSystem';
import { ArcTimeline } from './components/ArcTimeline';
import { MysteryArchive } from './components/MysteryArchive';
import { WarRecords } from './components/WarRecords';
import { Gallery } from './components/Gallery';
import { TrailersSection } from './components/TrailersSection';
import { MangaSection } from './components/MangaSection';
import { FinalQuestion } from './components/FinalQuestion';
import { Footer } from './components/Footer';
import { SpoilerModal } from './components/SpoilerModal';
import { LoadingScreen } from './components/LoadingScreen';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { FloatingParticles } from './components/common/FloatingParticles';
import { Eye, ShieldAlert } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [spoilerModalOpen, setSpoilerModalOpen] = useState<boolean>(false);
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Dynamic content loaded from server CMS
  const [dynamicContent, setDynamicContent] = useState<{
    settings?: any;
    characters?: any[];
    regions?: any[];
    storyArcs?: any[];
    mysteries?: any[];
    galleryItems?: any[];
    trailers?: any[];
    mangaRelease?: any;
  }>({});

  // Check URL pathname or hash for /admin
  const checkRoute = useCallback(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const isAdmin = path === '/admin' || path.startsWith('/admin/') || hash === '#admin';
      setIsAdminRoute(isAdmin);

      // Protect admin routes from search indexers
      let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
      if (isAdmin) {
        if (!metaRobots) {
          metaRobots = document.createElement('meta');
          metaRobots.name = 'robots';
          document.head.appendChild(metaRobots);
        }
        metaRobots.content = 'noindex, nofollow';
      } else if (metaRobots) {
        metaRobots.content = 'index, follow';
      }
    }
  }, []);

  // Check Admin session with server
  const checkAdminAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/check-session');
      if (res.ok) {
        const data = await res.json();
        setIsAdminAuthenticated(data.authenticated === true);
      } else {
        setIsAdminAuthenticated(false);
      }
    } catch {
      setIsAdminAuthenticated(false);
    }
  }, []);

  // Load public published CMS content
  const loadContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        setDynamicContent(data);
      }
    } catch {
      // Fallback to static data embedded in components
    }
  }, []);

  useEffect(() => {
    checkRoute();
    checkAdminAuth();
    loadContent();

    const handlePopState = () => {
      checkRoute();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Owner keyboard shortcut: Ctrl+Shift+A or Alt+A to enter owner console
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (e.altKey && (e.key === 'a' || e.key === 'A'))
      ) {
        e.preventDefault();
        navigateTo('/admin');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [checkRoute, checkAdminAuth, loadContent]);

  // Navigate to admin
  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      checkRoute();
    }
  };

  // If on /admin route and authenticated: render CMS dashboard
  if (isAdminRoute && isAdminAuthenticated && !isPreviewMode) {
    return (
      <AdminDashboard
        onLogout={() => {
          setIsAdminAuthenticated(false);
          navigateTo('/');
        }}
        onPreviewSite={() => {
          setIsPreviewMode(true);
          loadContent();
        }}
        onExitAdmin={() => navigateTo('/')}
      />
    );
  }

  // If on /admin route and unauthenticated: render secure Login
  if (isAdminRoute && !isAdminAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          setIsAdminAuthenticated(true);
          checkAdminAuth();
        }}
        onCancel={() => navigateTo('/')}
      />
    );
  }

  // Extract section visibility settings
  const visible = dynamicContent.settings?.visibleSections || {
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
  };

  // Sync theme accent color to root CSS variable
  useEffect(() => {
    if (dynamicContent.settings?.accentColor) {
      document.documentElement.style.setProperty('--primary-accent', dynamicContent.settings.accentColor);
    }
  }, [dynamicContent.settings?.accentColor]);

  // PUBLIC SITE VIEW (with optional Preview Mode banner)
  return (
    <div className="min-h-screen bg-[#050608] text-[#c0c5cc] selection:bg-[#9e2a2b] selection:text-white flex flex-col relative overflow-x-hidden">
      {/* Cinematic Initial Loading Sequence */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Floating Ash & Ember Particles Background Drift */}
      {dynamicContent.settings?.showAshParticles !== false && (
        <FloatingParticles color={dynamicContent.settings?.accentColor || '#9e2a2b'} />
      )}

      {/* Owner Preview Mode Notification Bar */}
      {isPreviewMode && (
        <div className="bg-[#1a080a] border-b border-[#9e2a2b] text-[#f2afb2] px-4 py-2 text-xs font-editorial-mono flex items-center justify-between sticky top-0 z-50 shadow-xl">
          <div className="flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-[#9e2a2b]" />
            <span className="font-bold">OWNER PREVIEW MODE ACTIVE</span>
            <span className="hidden sm:inline text-[#a67c7e]">· Showing published CMS data state</span>
          </div>
          <button
            onClick={() => {
              setIsPreviewMode(false);
              navigateTo('/admin');
            }}
            type="button"
            className="px-3 py-1 bg-[#9e2a2b] hover:bg-[#b83235] text-white text-[11px] font-cinzel tracking-wider uppercase font-semibold transition-colors"
          >
            [ RETURN TO CMS ]
          </button>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navigation
        onOpenSpoilerModal={() => setSpoilerModalOpen(true)}
        visibleSections={visible}
      />

      {/* Main Website Sections (Section 55 Sequence) */}
      <main className="flex-1 flex flex-col relative z-10">
        {/* 1. Hero Section */}
        <Hero settings={dynamicContent.settings} />

        {/* 2. The First Flood (Introduction) */}
        {visible.introduction !== false && <Introduction />}

        {/* 3. The Sea of Ash (Three Rules) */}
        {visible.seaOfAsh !== false && <SeaOfAsh />}

        {/* 4. The World (Five Regions) */}
        {visible.world !== false && <WorldSection regions={dynamicContent.regions} />}

        {/* 5. Characters (Key Dossiers) */}
        {visible.characters !== false && <CharactersSection characters={dynamicContent.characters} />}

        {/* 6. Ash (Miracles vs Mutations) */}
        {visible.ashSection !== false && <AshSection />}

        {/* 7. Character Relationships */}
        {visible.relationships !== false && <RelationshipGraph />}

        {/* 8. Romance (Some Things Are Never Said) */}
        {visible.romance !== false && <RomanceSection />}

        {/* 9. Oath System (Power Has A Price) */}
        {visible.oathSystem !== false && <OathSystem />}

        {/* 10. The Descent (Story Arcs Timeline) */}
        {visible.storyArcs !== false && <ArcTimeline storyArcs={dynamicContent.storyArcs} />}

        {/* 11. Mystery Archive (Classified Files) */}
        {visible.mysteries !== false && <MysteryArchive mysteries={dynamicContent.mysteries} />}

        {/* 12. Manga Release (Major Landmark) */}
        {visible.manga !== false && <MangaSection release={dynamicContent.mangaRelease} />}

        {/* 13. War Records (Censorship & Historical Fragments) */}
        {visible.warRecords !== false && <WarRecords />}

        {/* 14. Official Trailers & Video Archives */}
        {visible.trailers !== false && <TrailersSection trailers={dynamicContent.trailers} />}

        {/* 15. Visual Gallery & Lightbox */}
        {visible.gallery !== false && <Gallery galleryItems={dynamicContent.galleryItems} />}

        {/* 16. Final Question & Ending Epilogue Scene */}
        {visible.finalQuestion !== false && <FinalQuestion />}
      </main>

      {/* Official Anime Production Archive Footer */}
      <Footer
        settings={dynamicContent.settings}
      />

      {/* Deep Lore Spoiler Access Modal */}
      <SpoilerModal
        isOpen={spoilerModalOpen}
        onClose={() => setSpoilerModalOpen(false)}
      />
    </div>
  );
}
