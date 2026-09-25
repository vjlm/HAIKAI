import React, { useState } from 'react';
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
import { FinalQuestion } from './components/FinalQuestion';
import { Footer } from './components/Footer';
import { SpoilerModal } from './components/SpoilerModal';
import { LoadingScreen } from './components/LoadingScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [spoilerModalOpen, setSpoilerModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#050608] text-[#c0c5cc] selection:bg-[#9e2a2b] selection:text-white flex flex-col relative">
      {/* Cinematic Initial Loading Sequence */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Top Bar Navigation */}
      <Navigation onOpenSpoilerModal={() => setSpoilerModalOpen(true)} />

      {/* Main Website Sections */}
      <main className="flex-1 flex flex-col">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. The First Flood (Introduction) */}
        <Introduction />

        {/* 3. The Sea of Ash (Three Rules) */}
        <SeaOfAsh />

        {/* 4. Ash (Miracles vs Mutations) */}
        <AshSection />

        {/* 5. The World (Five Regions) */}
        <WorldSection />

        {/* 6. Characters (Key Dossiers) */}
        <CharactersSection />

        {/* 7. Character Relationships */}
        <RelationshipGraph />

        {/* 8. Romance (Some Things Are Never Said) */}
        <RomanceSection />

        {/* 9. Oath System (Power Has A Price) */}
        <OathSystem />

        {/* 10. The Descent (Story Arcs Timeline) */}
        <ArcTimeline />

        {/* 11. Mystery Archive (Classified Files) */}
        <MysteryArchive />

        {/* 12. War Records (Censorship & Historical Fragments) */}
        <WarRecords />

        {/* 13. Visual Gallery & Lightbox */}
        <Gallery />

        {/* 14. Final Question & Ending Epilogue Scene */}
        <FinalQuestion />
      </main>

      {/* Official Anime Production Archive Footer */}
      <Footer />

      {/* Deep Lore Spoiler Access Modal */}
      <SpoilerModal
        isOpen={spoilerModalOpen}
        onClose={() => setSpoilerModalOpen(false)}
      />
    </div>
  );
}
