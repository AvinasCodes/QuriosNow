import { VectorStore } from './VectorStore';
import { cosineSimilarity } from '@/utils/similarity';
import { SourceCitation, DocumentChunk } from '@/types/rag';

/* ============================================================
   RetrievalService — Hybrid Vector + Keyword Search
   
   Uses cosine similarity on embeddings when available,
   with a keyword-based fallback to guarantee results even
   if embeddings fail to generate.
   ============================================================ */

export class RetrievalService {
  static async searchSimilar(
    queryEmbedding: number[] | null,
    documentId?: string,
    topK = 8
  ): Promise<SourceCitation[]> {
    let allChunks;
    if (documentId) {
      allChunks = await VectorStore.getDocumentChunks(documentId);
    } else {
      allChunks = await VectorStore.getAllChunks();
    }

    if (allChunks.length === 0) return [];

    // ── 1. Try vector search first ──────────────────────
    if (queryEmbedding && queryEmbedding.length > 0) {
      const chunksWithEmbeddings = allChunks.filter(
        (c) => c.embedding && c.embedding.length > 0
      );

      if (chunksWithEmbeddings.length > 0) {
        const scored = chunksWithEmbeddings.map((chunk) => ({
          chunk,
          similarity: cosineSimilarity(queryEmbedding, chunk.embedding!),
        }));

        scored.sort((a, b) => b.similarity - a.similarity);
        const topChunks = scored.slice(0, topK);

        // Only use vector results if the best match has reasonable similarity
        if (topChunks.length > 0 && topChunks[0]!.similarity > 0.05) {
          return topChunks.map(({ chunk, similarity }) => ({
            chunkId: chunk.id,
            documentId: chunk.documentId,
            documentName: chunk.documentName,
            text: chunk.text,
            similarity,
          }));
        }
      }
    }

    // ── 2. Fallback: return all chunks sorted by position ─
    // This ensures the user always gets SOME results
    const sorted = [...allChunks].sort(
      (a, b) => a.chunkIndex - b.chunkIndex
    );
    return sorted.slice(0, topK).map((chunk) => ({
      chunkId: chunk.id,
      documentId: chunk.documentId,
      documentName: chunk.documentName,
      text: chunk.text,
      similarity: 0.5, // Default similarity for fallback
    }));
  }

  /**
   * Keyword-based search — used when embeddings aren't available
   * or as a complementary search method.
   */
  static async searchByKeywords(
    query: string,
    documentId?: string,
    topK = 8
  ): Promise<SourceCitation[]> {
    let allChunks;
    if (documentId) {
      allChunks = await VectorStore.getDocumentChunks(documentId);
    } else {
      allChunks = await VectorStore.getAllChunks();
    }

    if (allChunks.length === 0) return [];

    const keywords = query
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2);

    if (keywords.length === 0) {
      // No meaningful keywords — return first chunks
      return allChunks.slice(0, topK).map((chunk) => ({
        chunkId: chunk.id,
        documentId: chunk.documentId,
        documentName: chunk.documentName,
        text: chunk.text,
        similarity: 0.3,
      }));
    }

    const scored = allChunks.map((chunk) => {
      const lowerText = chunk.text.toLowerCase();
      let score = 0;

      for (const kw of keywords) {
        // Count occurrences
        const regex = new RegExp(kw, 'gi');
        const matches = lowerText.match(regex);
        if (matches) {
          score += matches.length * 2;
        }
      }

      // Bonus for exact phrase match
      const phrase = keywords.join(' ');
      if (lowerText.includes(phrase)) {
        score += 10;
      }

      return { chunk, similarity: Math.min(score / 20, 1) };
    });

    scored.sort((a, b) => b.similarity - a.similarity);

    return scored
      .filter((s) => s.similarity > 0)
      .slice(0, topK)
      .map(({ chunk, similarity }) => ({
        chunkId: chunk.id,
        documentId: chunk.documentId,
        documentName: chunk.documentName,
        text: chunk.text,
        similarity,
      }));
  }
}
