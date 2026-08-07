import { create } from 'zustand';
import type { AppView, Notification, RecentFileEntry } from '@/types';
import { uid } from '@/lib/utils';

/* ============================================================
   App Store — Zustand (UI state)
   ============================================================ */

interface AppState {
  /** Current view */
  currentView: AppView;
  /** Info panel open */
  isPanelOpen: boolean;
  /** Active notifications */
  notifications: Notification[];
  /** Recent files (persisted via localStorage) */
  recentFiles: RecentFileEntry[];

  // ─── Actions ───────────────────────────────────

  setView: (view: AppView) => void;
  togglePanel: () => void;
  setPanelOpen: (open: boolean) => void;
  addNotification: (type: Notification['type'], message: string) => void;
  removeNotification: (id: string) => void;
  addRecentFile: (entry: RecentFileEntry) => void;
  loadRecentFiles: () => void;
}

const RECENT_FILES_KEY = 'quriosnow-recent-files';
const MAX_RECENT_FILES = 10;
const NOTIFICATION_DURATION = 4000;

function loadFromStorage(): RecentFileEntry[] {
  try {
    const raw = localStorage.getItem(RECENT_FILES_KEY);
    return raw ? (JSON.parse(raw) as RecentFileEntry[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(files: RecentFileEntry[]) {
  try {
    localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(files));
  } catch {
    // localStorage might be full or unavailable
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  currentView: 'landing',
  isPanelOpen: true,
  notifications: [],
  recentFiles: loadFromStorage(),

  setView: (currentView) => set({ currentView }),

  togglePanel: () => set((s) => ({ isPanelOpen: !s.isPanelOpen })),

  setPanelOpen: (isPanelOpen) => set({ isPanelOpen }),

  addNotification: (type, message) => {
    const notification: Notification = {
      id: uid(),
      type,
      message,
      timestamp: Date.now(),
    };
    set((s) => ({
      notifications: [...s.notifications, notification],
    }));

    // Auto-remove after duration
    setTimeout(() => {
      get().removeNotification(notification.id);
    }, NOTIFICATION_DURATION);
  },

  removeNotification: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    })),

  addRecentFile: (entry) => {
    set((s) => {
      // Remove duplicate by name, then prepend
      const filtered = s.recentFiles.filter((f) => f.name !== entry.name);
      const updated = [entry, ...filtered].slice(0, MAX_RECENT_FILES);
      saveToStorage(updated);
      return { recentFiles: updated };
    });
  },

  loadRecentFiles: () => {
    set({ recentFiles: loadFromStorage() });
  },
}));
