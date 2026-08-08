import { create } from 'zustand';
import type { RagDocument, DocumentChunk, ChatMessage } from '@/types/rag';
import { uid } from '@/lib/utils';

interface RagState {
  documents: RagDocument[];
  activeDocument: RagDocument | null;
  activeDocumentText: string;
  chunks: DocumentChunk[];
  messages: ChatMessage[];
  loadingStage: string;
  isLoading: boolean;
  modelStatus: 'idle' | 'downloading' | 'ready' | 'error';
  
  // Actions
  addDocument: (doc: RagDocument, text: string) => void;
  setActiveDocument: (id: string) => void;
  setChunks: (chunks: DocumentChunk[]) => void;
  addMessage: (msg: ChatMessage) => void;
  updateMessage: (id: string, partialMsg: Partial<ChatMessage>) => void;
  clearMessages: () => void;
  setLoading: (isLoading: boolean, stage?: string) => void;
  setModelStatus: (status: 'idle' | 'downloading' | 'ready' | 'error') => void;
}

export const useRagStore = create<RagState>((set, get) => ({
  documents: [],
  activeDocument: null,
  activeDocumentText: '',
  chunks: [],
  messages: [],
  loadingStage: '',
  isLoading: false,
  modelStatus: 'ready',

  addDocument: (doc, text) =>
    set((state) => {
      const existing = state.documents.filter((d) => d.id !== doc.id);
      return { 
        documents: [doc, ...existing], 
        activeDocument: doc,
        activeDocumentText: text,
        chunks: [],
        messages: []
      };
    }),

  setActiveDocument: (id) =>
    set((state) => {
      const doc = state.documents.find((d) => d.id === id) || null;
      return { activeDocument: doc };
    }),

  setChunks: (chunks) => set({ chunks }),

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  updateMessage: (id, partialMsg) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, ...partialMsg } : m
      ),
    })),

  clearMessages: () => set({ messages: [] }),

  setLoading: (isLoading, stage = '') => set({ isLoading, loadingStage: stage }),

  setModelStatus: (modelStatus) => set({ modelStatus })
}));
