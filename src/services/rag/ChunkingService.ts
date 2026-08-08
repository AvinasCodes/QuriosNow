import { DocumentChunk } from '@/types/rag';
import { uid } from '@/lib/utils';

/* ============================================================
   ChunkingService — Paragraph & sentence-aware text splitting
   with overlap for better retrieval accuracy.
   ============================================================ */

export class ChunkingService {
  static chunkText(
    text: string,
    documentId: string,
    documentName: string,
    maxChars = 1500,
    overlapChars = 200
  ): DocumentChunk[] {
    // Clean the text
    const cleaned = text
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, '  ')
      .replace(/ {3,}/g, '  ');

    // First, try to split into natural paragraphs
    const paragraphs = cleaned
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const chunks: DocumentChunk[] = [];
    let currentChunkParts: string[] = [];
    let currentLength = 0;
    let globalPos = 0;
    let chunkStartPos = 0;

    const flushChunk = () => {
      if (currentChunkParts.length === 0) return;
      const chunkText = currentChunkParts.join('\n\n').trim();
      if (chunkText.length > 10) {
        chunks.push({
          id: uid(),
          documentId,
          documentName,
          text: chunkText,
          chunkIndex: chunks.length,
          startPosition: chunkStartPos,
          endPosition: chunkStartPos + chunkText.length,
        });
      }
    };

    for (const para of paragraphs) {
      // If a single paragraph is bigger than maxChars, split it by sentences
      if (para.length > maxChars) {
        // Flush what we have
        flushChunk();
        currentChunkParts = [];
        currentLength = 0;

        // Split large paragraph by sentences
        const sentences = para.split(/(?<=[.!?])\s+/);
        let sentenceBuf: string[] = [];
        let sentenceLen = 0;

        for (const sentence of sentences) {
          if (sentenceLen + sentence.length > maxChars && sentenceBuf.length > 0) {
            const chunkText = sentenceBuf.join(' ').trim();
            if (chunkText.length > 10) {
              chunks.push({
                id: uid(),
                documentId,
                documentName,
                text: chunkText,
                chunkIndex: chunks.length,
                startPosition: globalPos,
                endPosition: globalPos + chunkText.length,
              });
            }
            // Keep last sentence for overlap
            const lastSentence = sentenceBuf[sentenceBuf.length - 1] || '';
            sentenceBuf = [lastSentence];
            sentenceLen = lastSentence.length;
          }
          sentenceBuf.push(sentence);
          sentenceLen += sentence.length + 1;
        }

        // Flush remaining sentences
        if (sentenceBuf.length > 0) {
          const chunkText = sentenceBuf.join(' ').trim();
          if (chunkText.length > 10) {
            chunks.push({
              id: uid(),
              documentId,
              documentName,
              text: chunkText,
              chunkIndex: chunks.length,
              startPosition: globalPos,
              endPosition: globalPos + chunkText.length,
            });
          }
        }

        chunkStartPos = globalPos + para.length;
      } else {
        // Normal paragraph — accumulate
        if (currentLength + para.length > maxChars && currentChunkParts.length > 0) {
          flushChunk();

          // Keep last paragraph for overlap context
          const lastPart = currentChunkParts[currentChunkParts.length - 1] || '';
          if (lastPart.length <= overlapChars) {
            currentChunkParts = [lastPart];
            currentLength = lastPart.length;
          } else {
            currentChunkParts = [];
            currentLength = 0;
          }
          chunkStartPos = globalPos;
        }

        if (currentChunkParts.length === 0) {
          chunkStartPos = globalPos;
        }
        currentChunkParts.push(para);
        currentLength += para.length;
      }

      globalPos += para.length + 2; // +2 for the \n\n between paragraphs
    }

    // Flush remaining
    flushChunk();

    return chunks;
  }
}
