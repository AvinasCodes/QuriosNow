/* ============================================================
   LLMService — Intelligent Retrieval-Based Answer Generation

   Extracts RELEVANT sentences from retrieved chunks that
   actually answer the user's question, instead of dumping
   raw text. Uses keyword matching, sentence scoring, and
   question-type detection for precise answers.
   ============================================================ */

export class LLMService {
  static isReady(): boolean {
    return true;
  }

  static async *generateStream(
    question: string,
    contextChunks: string[],
    _onFinish?: (text: string) => void
  ): AsyncGenerator<string> {
    if (contextChunks.length === 0) {
      const msg =
        "I couldn't find any relevant information in the uploaded document for your query. Try rephrasing your question or using different keywords.";
      yield msg;
      _onFinish?.(msg);
      return;
    }

    const lowerQ = question.toLowerCase();

    // ── Extract keywords from the question ──────────────
    const stopWords = new Set([
      'what', 'is', 'the', 'a', 'an', 'of', 'in', 'to', 'for', 'and',
      'or', 'on', 'at', 'by', 'with', 'from', 'this', 'that', 'it',
      'are', 'was', 'were', 'be', 'been', 'has', 'have', 'had', 'do',
      'does', 'did', 'will', 'would', 'could', 'should', 'may', 'can',
      'about', 'how', 'who', 'when', 'where', 'why', 'which', 'all',
      'any', 'each', 'find', 'tell', 'me', 'please', 'give', 'show',
      'list', 'describe', 'explain', 'summarize', 'summary', 'main',
      'document', 'file', 'there', 'these', 'those', 'them', 'they',
      'i', 'you', 'we', 'my', 'your', 'our', 'some', 'many', 'much',
      'get', 'got', 'say', 'said', 'says', 'also', 'just', 'if', 'but',
      'not', 'no', 'so', 'up', 'out', 'then', 'than', 'more', 'most',
      'only', 'very', 'too', 'into', 'over', 'after', 'before', 'between',
    ]);
    const keywords = lowerQ
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));

    // ── Detect question type ────────────────────────────
    const isSummary =
      lowerQ.includes('summar') ||
      lowerQ.includes('overview') ||
      lowerQ.includes('about') ||
      lowerQ.includes('key point') ||
      lowerQ.includes('main idea') ||
      lowerQ.includes('gist');

    const isList =
      lowerQ.includes('list') ||
      lowerQ.includes('mention') ||
      lowerQ.includes('find all') ||
      lowerQ.includes('enumerate');

    const isWho = lowerQ.startsWith('who');
    const isWhen = lowerQ.startsWith('when');
    const isWhere = lowerQ.startsWith('where');
    const isHowMany = lowerQ.includes('how many') || lowerQ.includes('how much');

    // ── Score and extract relevant sentences ─────────────
    const allSentences: { text: string; score: number; chunkIdx: number }[] = [];

    for (let ci = 0; ci < contextChunks.length; ci++) {
      const chunk = contextChunks[ci]!;
      // Split into sentences (handles ., !, ?, and newlines)
      const sentences = chunk
        .split(/(?<=[.!?])\s+|\n+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 15);

      for (const sentence of sentences) {
        const lowerS = sentence.toLowerCase();
        let score = 0;

        // Keyword match scoring
        for (const kw of keywords) {
          if (lowerS.includes(kw)) {
            score += 3;
            // Bonus if keyword appears near the start
            if (lowerS.indexOf(kw) < 50) score += 1;
          }
        }

        // Exact phrase match bonus
        if (keywords.length >= 2) {
          const phrase = keywords.join(' ');
          if (lowerS.includes(phrase)) score += 5;
        }

        // Question-type specific boosting
        if (isWho && /\b(he|she|they|mr|ms|dr|prof|president|ceo|founder|author|name)\b/i.test(sentence)) score += 2;
        if (isWhen && /\b(\d{4}|\d{1,2}\/\d|january|february|march|april|may|june|july|august|september|october|november|december|year|date|month)\b/i.test(sentence)) score += 2;
        if (isWhere && /\b(location|city|country|state|place|region|area|address|office|building)\b/i.test(sentence)) score += 2;
        if (isHowMany && /\b\d+\b/.test(sentence)) score += 2;

        // Chunk position bonus (earlier chunks from retrieval are more relevant)
        score += Math.max(0, (5 - ci)) * 0.5;

        // Penalize very short or very long sentences
        if (sentence.length < 30) score -= 1;
        if (sentence.length > 800) score -= 1;

        if (score > 0) {
          allSentences.push({ text: sentence, score, chunkIdx: ci });
        }
      }
    }

    // Sort by score descending
    allSentences.sort((a, b) => b.score - a.score);

    // Deduplicate (remove near-identical sentences)
    const seen = new Set<string>();
    const uniqueSentences = allSentences.filter((s) => {
      const key = s.text.substring(0, 60).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // ── Build the response ──────────────────────────────
    let fullResponse = '';

    if (uniqueSentences.length === 0) {
      // Fallback: show raw chunks if sentence extraction found nothing
      fullResponse = `Here is the most relevant section from the document:\n\n`;
      fullResponse += contextChunks[0]!.trim().substring(0, 800);
    } else if (isSummary) {
      const top = uniqueSentences.slice(0, 8);
      fullResponse = `Here is a summary based on the document:\n\n`;
      top.forEach((s) => {
        fullResponse += `${s.text}\n\n`;
      });
    } else if (isList) {
      const top = uniqueSentences.slice(0, 10);
      fullResponse = `Here are the relevant items found in the document:\n\n`;
      top.forEach((s, i) => {
        fullResponse += `${i + 1}. ${s.text}\n\n`;
      });
    } else {
      // Specific question — pick the best sentences
      const top = uniqueSentences.slice(0, 5);

      if (top.length === 1) {
        fullResponse = `${top[0]!.text}`;
      } else {
        fullResponse = `Based on the document:\n\n`;
        top.forEach((s) => {
          fullResponse += `▸ ${s.text}\n\n`;
        });
      }
    }

    // ── Stream the response word by word ────────────────
    const words = fullResponse.split(' ');
    let accumulated = '';
    for (let i = 0; i < words.length; i++) {
      const word = words[i] + (i < words.length - 1 ? ' ' : '');
      accumulated += word;
      yield word;
      if (i % 4 === 0) {
        await new Promise((r) => setTimeout(r, 12));
      }
    }

    _onFinish?.(accumulated);
  }
}
