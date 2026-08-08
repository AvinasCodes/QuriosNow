export interface RagDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: number;
  chunkCount: number;
  indexStatus: 'pending' | 'indexing' | 'indexed' | 'error';
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentName: string;
  text: string;
  chunkIndex: number;
  startPosition: number;
  endPosition: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: SourceCitation[];
}

export interface SourceCitation {
  chunkId: string;
  documentId: string;
  documentName: string;
  text: string;
  similarity: number;
}
