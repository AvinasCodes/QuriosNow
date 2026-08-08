import { ChunkingService } from './ChunkingService';
import { EmbeddingService } from './EmbeddingService';
import { VectorStore } from './VectorStore';
import { useRagStore } from '@/store/useRagStore';
import { uid } from '@/lib/utils';
import { RagDocument } from '@/types/rag';

/* ============================================================
   RAGService — Document Processing Orchestrator
   
   Handles chunking, embedding, and indexing. If embeddings
   fail (e.g. model download issue), chunks are still saved
   to IndexedDB so keyword search can work as a fallback.
   ============================================================ */

export class RAGService {
  private static embeddingService: EmbeddingService | null = null;

  static async processDocument(file: File, text: string) {
    const store = useRagStore.getState();
    const docId = uid();

    const doc: RagDocument = {
      id: docId,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: Date.now(),
      chunkCount: 0,
      indexStatus: 'pending',
    };

    store.addDocument(doc, text);

    try {
      // ── 1. Chunking ───────────────────────────────────
      store.setLoading(true, 'chunking');
      await new Promise((r) => setTimeout(r, 500));

      const chunks = ChunkingService.chunkText(text, docId, file.name);

      store.addDocument(
        { ...doc, chunkCount: chunks.length, indexStatus: 'indexing' },
        text
      );
      store.setChunks(chunks);

      // ── 2. Save chunks to IndexedDB immediately ───────
      // This ensures keyword search works even if embeddings fail
      store.setLoading(true, 'indexing');
      await new Promise((r) => setTimeout(r, 300));

      await VectorStore.addDocument({
        ...doc,
        chunkCount: chunks.length,
        indexStatus: 'indexed',
      });
      await VectorStore.saveChunks(
        chunks.map((c) => ({ ...c, embedding: undefined }))
      );

      // ── 3. Generate embeddings (non-blocking) ─────────
      store.setLoading(true, 'embedding');

      let embeddingsSucceeded = false;
      try {
        if (!this.embeddingService) {
          this.embeddingService = new EmbeddingService();
        }

        // Process in small batches
        for (let i = 0; i < chunks.length; i += 5) {
          const batch = chunks.slice(i, i + 5);
          const texts = batch.map((c) => c.text);
          const embeddings = await this.embeddingService.embedTexts(texts);

          // Validate embeddings
          if (embeddings && Array.isArray(embeddings)) {
            batch.forEach((c, idx) => {
              const emb = embeddings[idx];
              if (emb && Array.isArray(emb) && emb.length > 0) {
                (c as any).embedding = emb;
              }
            });
          }
        }

        // Save chunks WITH embeddings
        await VectorStore.saveChunks(chunks as any);
        embeddingsSucceeded = true;
      } catch (embError) {
        console.warn(
          'Embedding generation failed — keyword search will be used as fallback:',
          embError
        );
      }

      // ── 4. Finalize ───────────────────────────────────
      store.addDocument(
        { ...doc, chunkCount: chunks.length, indexStatus: 'indexed' },
        text
      );

      store.setLoading(true, 'ready');
      await new Promise((r) => setTimeout(r, 500));
      store.setLoading(false);
    } catch (e) {
      console.error('Document processing failed:', e);
      store.addDocument({ ...doc, indexStatus: 'error' }, text);
      store.setLoading(false);
      throw e;
    }
  }
}
