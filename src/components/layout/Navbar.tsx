import { useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useDataStore } from '@/store/useDataStore';
import { useFileUpload } from '@/hooks/useFileUpload';
import { RetroButton } from '@/components/ui/RetroButton';
import {
  VscCloudUpload,
  VscBook,
  VscGithubInverted,
  VscArrowLeft,
} from 'react-icons/vsc';

/* ============================================================
   Navbar — Top navigation bar
   ============================================================ */

export function Navbar() {
  const currentView = useAppStore((s) => s.currentView);
  const setView = useAppStore((s) => s.setView);
  const clearDataset = useDataStore((s) => s.clearDataset);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { onFileInputChange } = useFileUpload();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleBackToLanding = () => {
    clearDataset();
    setView('landing');
  };

  return (
    <nav
      className="sticky top-0 z-[100] border-b border-[var(--crt-border)]"
      style={{ background: 'rgba(11, 15, 12, 0.92)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-[1800px] mx-auto px-4 h-12 flex items-center gap-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={currentView === 'table' ? handleBackToLanding : undefined}
        >
          {currentView === 'table' && (
            <VscArrowLeft className="text-[var(--crt-muted)] hover:text-[var(--crt-green)] transition-colors mr-1" size={16} />
          )}
          <img src="/icon.png" alt="QuriosNow Logo" className="w-7 h-7 rounded" />
          <span className="font-pixel text-[10px] text-crt-green glow-green tracking-wider hidden sm:inline">
            QuriosNow
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Nav Buttons */}
        <div className="flex items-center gap-2">
          <RetroButton
            variant="filled-green"
            size="sm"
            icon={<VscCloudUpload size={14} />}
            onClick={handleUploadClick}
          >
            Upload
          </RetroButton>

          <RetroButton
            variant="ghost"
            size="sm"
            icon={<VscBook size={14} />}
            onClick={() => setView('docs')}
          >
            <span className="hidden md:inline">Docs</span>
          </RetroButton>

          <RetroButton
            variant="ghost"
            size="sm"
            icon={<VscGithubInverted size={14} />}
            onClick={() => window.open('https://github.com/AvinasCodes/QuriosNow.git', '_blank')}
          >
            <span className="hidden md:inline">GitHub</span>
          </RetroButton>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={onFileInputChange}
          className="hidden"
          id="navbar-file-input"
        />
      </div>
    </nav>
  );
}
