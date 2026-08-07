import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { ScanlineOverlay } from '@/components/ui/ScanlineOverlay';
import { NotificationContainer } from '@/components/ui/RetroNotification';

/* ============================================================
   Layout — Main app shell
   ============================================================ */

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-crt-bg animate-flicker">
      <ScanlineOverlay />
      <NotificationContainer />
      <Navbar />
      <main className="relative">{children}</main>
    </div>
  );
}
