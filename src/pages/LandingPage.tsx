import { HeroSection } from '@/components/landing/HeroSection';
import { UploadZone } from '@/components/landing/UploadZone';
import { RecentFiles } from '@/components/landing/RecentFiles';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { BootSequence } from '@/components/ui/BootSequence';
import { useDataStore } from '@/store/useDataStore';
import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';

/* ============================================================
   LandingPage — Home page with hero, upload, recent, features
   ============================================================ */

export function LandingPage() {
  const isLoading = useDataStore((s) => s.isLoading);
  const setView = useAppStore((s) => s.setView);
  const [showBoot, setShowBoot] = useState(false);

  // Show boot sequence when loading starts
  if (isLoading && !showBoot) {
    setShowBoot(true);
  }

  return (
    <>
      {/* Boot sequence overlay during file processing */}
      {showBoot && isLoading && (
        <BootSequence
          onComplete={() => {
            setShowBoot(false);
          }}
        />
      )}

      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
        <HeroSection />
        <UploadZone />
        <RecentFiles />
        <FeaturesSection />

        {/* Footer */}
        <footer className="border-t border-[var(--crt-border)] py-6 text-center">
          <p className="font-mono text-[10px] text-crt-muted tracking-wider">
            QuriosNow v1.0.0 ─ No backend. No tracking. 100% browser-native.
          </p>
        </footer>
      </div>
    </>
  );
}
