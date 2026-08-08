import { Layout } from '@/components/layout/Layout';

import { LandingPage } from '@/pages/LandingPage';
import { TablePage } from '@/pages/TablePage';
import { DocsPage } from '@/pages/DocsPage';
import { RagPage } from '@/pages/RagPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { TermsPage } from '@/pages/TermsPage';
import { AboutPage } from '@/pages/AboutPage';
import { useAppStore } from '@/store/useAppStore';

/* ============================================================
   App — Root component, view router
   ============================================================ */

export default function App() {
  const currentView = useAppStore((s) => s.currentView);

  return (
    <Layout>
      {currentView === 'landing' && <LandingPage />}
      {currentView === 'table' && <TablePage />}
      {currentView === 'rag' && <RagPage />}
      {currentView === 'docs' && <DocsPage />}
      {currentView === 'privacy' && <PrivacyPage />}
      {currentView === 'terms' && <TermsPage />}
      {currentView === 'about' && <AboutPage />}
    </Layout>
  );
}

