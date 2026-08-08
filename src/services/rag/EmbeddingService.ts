import { uid } from '@/lib/utils';

export class EmbeddingService {
  private worker: Worker;
  private resolvers: Map<string, { resolve: (val: any) => void; reject: (err: any) => void }> = new Map();

  constructor() {
    this.worker = new Worker(new URL('../../workers/embedding.worker.ts', import.meta.url), {
      type: 'module'
    });

    this.worker.addEventListener('message', (event) => {
      const { status, id, output, error } = event.data;
      if (status === 'complete') {
        if (id && this.resolvers.has(id)) {
          this.resolvers.get(id)!.resolve(output);
          this.resolvers.delete(id);
        }
      } else if (status === 'error') {
        if (id && this.resolvers.has(id)) {
          this.resolvers.get(id)!.reject(new Error(error));
          this.resolvers.delete(id);
        }
      } else if (status === 'progress') {
        // Optional: Dispatch progress to store
      }
    });
  }

  async embedText(text: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
      const id = uid();
      this.resolvers.set(id, { resolve, reject });
      this.worker.postMessage({ type: 'embed', text, id });
    });
  }

  async embedTexts(texts: string[]): Promise<number[][]> {
    return new Promise((resolve, reject) => {
      const id = uid();
      this.resolvers.set(id, { resolve, reject });
      this.worker.postMessage({ type: 'embedBatch', texts, id });
    });
  }
}
