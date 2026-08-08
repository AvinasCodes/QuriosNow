import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRagStore } from '@/store/useRagStore';
import { VscSend, VscRefresh, VscChevronDown, VscChevronUp, VscCopy, VscCheck } from 'react-icons/vsc';
import { RetrievalService } from '@/services/rag/RetrievalService';
import { LLMService } from '@/services/rag/LLMService';
import { uid } from '@/lib/utils';
import { EmbeddingService } from '@/services/rag/EmbeddingService';
import type { ChatMessage } from '@/types/rag';

/* ============================================================
   ChatPanel — AI Query Terminal
   ============================================================ */

const SUGGESTED_QUERIES = [
  'What is this document about?',
  'Summarize the key points.',
  'What are the main conclusions?',
  'Who are the main people mentioned?',
  'What are the important dates?',
  'Find all mentions of key terms.',
];

// Singleton embedding service so we don't re-initialize the worker each query
let embeddingServiceInstance: EmbeddingService | null = null;
function getEmbeddingService() {
  if (!embeddingServiceInstance) {
    embeddingServiceInstance = new EmbeddingService();
  }
  return embeddingServiceInstance;
}

export function ChatPanel() {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSources, setExpandedSources] = useState<string | null>(null);

  const messages = useRagStore((s) => s.messages);
  const addMessage = useRagStore((s) => s.addMessage);
  const updateMessage = useRagStore((s) => s.updateMessage);
  const activeDocument = useRagStore((s) => s.activeDocument);
  const clearMessages = useRagStore((s) => s.clearMessages);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const executeQuery = useCallback(
    async (queryText: string) => {
      if (!queryText.trim() || isGenerating) return;

      const userText = queryText.trim();
      setInput('');

      // Add user message
      addMessage({
        id: uid(),
        role: 'user',
        content: userText,
        timestamp: Date.now(),
      });

      setIsGenerating(true);

      try {
        // 1. Try embedding-based search first, with keyword fallback
        let sources: import('@/types/rag').SourceCitation[] = [];
        try {
          const embService = getEmbeddingService();
          const queryEmb = await embService.embedText(userText);
          sources = await RetrievalService.searchSimilar(
            queryEmb,
            activeDocument?.id
          );
        } catch (embError) {
          console.warn('Embedding failed, falling back to keyword search:', embError);
          sources = [];
        }

        // 2. If vector search returned nothing, use keyword search
        if (sources.length === 0) {
          sources = await RetrievalService.searchByKeywords(
            userText,
            activeDocument?.id
          );
        }

        // 3. Generate streamed response
        const assistantId = uid();
        let currentContent = '';

        addMessage({
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
          sources,
        });

        const contextChunks = sources.map((s) => s.text);

        for await (const chunk of LLMService.generateStream(
          userText,
          contextChunks
        )) {
          currentContent += chunk;
          updateMessage(assistantId, { content: currentContent });
        }
      } catch (e) {
        console.error(e);
        addMessage({
          id: uid(),
          role: 'assistant',
          content:
            'Error: Failed to process your query. The embedding model may still be loading. Please try again in a moment.',
          timestamp: Date.now(),
        });
      } finally {
        setIsGenerating(false);
        inputRef.current?.focus();
      }
    },
    [isGenerating, addMessage, updateMessage, activeDocument]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeQuery(input);
  };

  const handleSuggestionClick = (query: string) => {
    executeQuery(query);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* ── Header ────────────────────────────────────── */}
      <div
        className="shrink-0 px-3 py-2.5 border-b border-[var(--crt-border)] flex justify-between items-center"
        style={{ background: 'rgba(5, 8, 6, 0.6)' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--crt-green)] animate-pulse" />
          <span className="text-[10px] font-mono tracking-[0.3em] text-[var(--crt-amber)]">
            QURIOSNOW AI TERMINAL
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-[var(--crt-green)]/60 hidden sm:inline">
            RETRIEVAL ENGINE: ACTIVE
          </span>
          <button
            onClick={clearMessages}
            className="p-1 text-[var(--crt-muted)] hover:text-[var(--crt-amber)] transition-colors"
            title="Clear conversation"
          >
            <VscRefresh size={13} />
          </button>
        </div>
      </div>

      {/* ── Messages ──────────────────────────────────── */}
      <div
        className="flex-1 overflow-auto px-3 py-4 custom-scrollbar space-y-4"
        style={{ background: 'rgba(5, 8, 6, 0.3)' }}
      >
        {/* Empty State with Suggestions */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center pt-6"
          >
            {/* ASCII Art */}
            <pre className="text-[var(--crt-green)]/20 text-[8px] leading-tight font-mono mb-4 hidden sm:block">
{`  ╔══════════════════════════╗
  ║   DOCUMENT INTELLIGENCE  ║
  ║      READY TO QUERY      ║
  ╚══════════════════════════╝`}
            </pre>

            <p className="text-[var(--crt-muted)] text-xs font-mono mb-5 text-center">
              Ask anything about your uploaded document.
              <br />
              <span className="text-[var(--crt-green)]/40">
                All processing happens locally in your browser.
              </span>
            </p>

            {/* Suggestion Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {SUGGESTED_QUERIES.map((q, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => handleSuggestionClick(q)}
                  disabled={isGenerating}
                  className="text-left px-3 py-2 border border-[var(--crt-border)] text-[11px] font-mono text-[var(--crt-muted)] hover:text-[var(--crt-green)] hover:border-[var(--crt-green)]/30 hover:bg-[var(--crt-green)]/5 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="text-[var(--crt-green)]/50">▸ </span>
                  {q}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Message List */}
        <AnimatePresence>
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              isExpanded={expandedSources === msg.id}
              onToggleSources={() =>
                setExpandedSources(expandedSources === msg.id ? null : msg.id)
              }
              onCopy={handleCopy}
            />
          ))}
        </AnimatePresence>

        {/* Generating Indicator */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-[10px] font-mono text-[var(--crt-amber)]"
          >
            <span className="animate-pulse">▸</span>
            SEARCHING DOCUMENT & GENERATING RESPONSE...
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input Bar ─────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-[var(--crt-border)] flex items-center gap-2 px-3 py-2"
        style={{ background: 'rgba(5, 8, 6, 0.8)' }}
      >
        <span className="text-[var(--crt-green)]/40 font-mono text-sm shrink-0">▸</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the document..."
          className="flex-1 bg-transparent border-none outline-none text-[var(--crt-green)] placeholder-[var(--crt-muted)]/40 font-mono text-sm"
          disabled={isGenerating}
          autoFocus
        />
        <button
          type="submit"
          disabled={!input.trim() || isGenerating}
          className="p-1.5 border border-[var(--crt-border)] text-[var(--crt-green)] hover:bg-[var(--crt-green)]/10 hover:border-[var(--crt-green)]/50 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <VscSend size={14} />
        </button>
      </form>
    </div>
  );
}

/* ============================================================
   MessageBubble — Individual chat message component
   ============================================================ */

function MessageBubble({
  msg,
  isExpanded,
  onToggleSources,
  onCopy,
}: {
  msg: ChatMessage;
  isExpanded: boolean;
  onToggleSources: () => void;
  onCopy: (text: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  const handleCopy = () => {
    onCopy(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[90%] ${isUser ? 'text-right' : 'text-left'}`}>
        {/* Role Label */}
        <div
          className={`text-[9px] font-mono tracking-widest mb-1 ${
            isUser ? 'text-[var(--crt-amber)]/60' : 'text-[var(--crt-green)]/60'
          }`}
        >
          {isUser ? 'USER' : 'QURIOSNOW AI'}
        </div>

        {/* Message Content */}
        <div
          className={`px-3 py-2.5 text-sm font-mono leading-relaxed border ${
            isUser
              ? 'bg-[var(--crt-amber)]/5 border-[var(--crt-amber)]/20 text-[var(--crt-amber)]'
              : 'bg-[var(--crt-green)]/5 border-[var(--crt-green)]/15 text-gray-300'
          }`}
        >
          <div className="whitespace-pre-wrap break-words">
            {msg.content || (
              <span className="text-[var(--crt-muted)] animate-pulse">
                Processing...
              </span>
            )}
          </div>
        </div>

        {/* Action Bar (for assistant messages) */}
        {!isUser && msg.content && (
          <div className="flex items-center gap-2 mt-1.5">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="text-[var(--crt-muted)] hover:text-[var(--crt-green)] transition-colors p-0.5"
              title="Copy response"
            >
              {copied ? <VscCheck size={11} /> : <VscCopy size={11} />}
            </button>

            {/* Sources Toggle */}
            {msg.sources && msg.sources.length > 0 && (
              <button
                onClick={onToggleSources}
                className="flex items-center gap-1 text-[10px] font-mono text-[var(--crt-muted)] hover:text-[var(--crt-amber)] transition-colors"
              >
                {msg.sources.length} SOURCE{msg.sources.length > 1 ? 'S' : ''}
                {isExpanded ? (
                  <VscChevronUp size={11} />
                ) : (
                  <VscChevronDown size={11} />
                )}
              </button>
            )}
          </div>
        )}

        {/* Expanded Sources */}
        <AnimatePresence>
          {isExpanded && msg.sources && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-2"
            >
              <div className="border border-[var(--crt-border)] bg-[#050806] p-2 space-y-2">
                <div className="text-[9px] font-mono tracking-widest text-[var(--crt-amber)] border-b border-[var(--crt-border)] pb-1">
                  RETRIEVED DOCUMENT CHUNKS
                </div>
                {msg.sources.map((s, idx) => (
                  <div
                    key={idx}
                    className="border-l-2 border-[var(--crt-green)]/30 pl-2"
                  >
                    <div className="text-[9px] font-mono text-[var(--crt-amber)]/70 mb-0.5">
                      [{idx + 1}] {s.documentName} — similarity:{' '}
                      {(s.similarity * 100).toFixed(1)}%
                    </div>
                    <div className="text-[11px] font-mono text-[var(--crt-muted)] leading-relaxed line-clamp-3">
                      {s.text}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
