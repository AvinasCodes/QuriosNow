import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { DocumentChunk, RagDocument } from '@/types/rag';

interface RagDBSchema extends DBSchema {
  documents: {
    key: string;
    value: RagDocument;
  };
  chunks: {
    key: string;
    value: DocumentChunk & { embedding?: number[] };
    indexes: { 'by-documentId': string };
  };
}

const DB_NAME = 'QuriosNowRAG';
const DB_VERSION = 1;

export class VectorStore {
  private static dbPromise: Promise<IDBPDatabase<RagDBSchema>>;

  private static getDB() {
    if (!this.dbPromise) {
      this.dbPromise = openDB<RagDBSchema>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('documents')) {
            db.createObjectStore('documents', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('chunks')) {
            const chunkStore = db.createObjectStore('chunks', { keyPath: 'id' });
            chunkStore.createIndex('by-documentId', 'documentId');
          }
        },
      });
    }
    return this.dbPromise;
  }

  static async addDocument(doc: RagDocument): Promise<void> {
    const db = await this.getDB();
    await db.put('documents', doc);
  }

  static async getDocuments(): Promise<RagDocument[]> {
    const db = await this.getDB();
    return await db.getAll('documents');
  }

  static async deleteDocument(docId: string): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction(['documents', 'chunks'], 'readwrite');
    await tx.objectStore('documents').delete(docId);
    
    const chunksStore = tx.objectStore('chunks');
    const index = chunksStore.index('by-documentId');
    let cursor = await index.openCursor(docId);
    while (cursor) {
      await cursor.delete();
      cursor = await cursor.continue();
    }
    await tx.done;
  }

  static async saveChunks(chunks: (DocumentChunk & { embedding?: number[] })[]): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction('chunks', 'readwrite');
    await Promise.all([
      ...chunks.map(chunk => tx.store.put(chunk)),
      tx.done
    ]);
  }

  static async getDocumentChunks(documentId: string): Promise<(DocumentChunk & { embedding?: number[] })[]> {
    const db = await this.getDB();
    return await db.getAllFromIndex('chunks', 'by-documentId', documentId);
  }

  static async getAllChunks(): Promise<(DocumentChunk & { embedding?: number[] })[]> {
    const db = await this.getDB();
    return await db.getAll('chunks');
  }
}
