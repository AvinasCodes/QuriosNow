import { Layout } from '@/components/layout/Layout';
import { LandingPage } from '@/pages/LandingPage';
import { TablePage } from '@/pages/TablePage';
import { DocsPage } from '@/pages/DocsPage';
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
      {currentView === 'docs' && <DocsPage />}
    </Layout>
  );
}

