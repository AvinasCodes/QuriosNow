import { pipeline, env, FeatureExtractionPipeline } from '@huggingface/transformers';

// Skip local model check since we're in browser
env.allowLocalModels = false;

class EmbeddingPipeline {
  static task: any = 'feature-extraction';
  static model = 'Xenova/all-MiniLM-L6-v2';
  static instance: Promise<FeatureExtractionPipeline> | null = null;

  static async getInstance(progress_callback?: (msg: any) => void) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback }) as Promise<FeatureExtractionPipeline>;
    }
    return this.instance;
  }
}

self.addEventListener('message', async (event) => {
  const { type, text, texts, id } = event.data;
  
  try {
    const extractor = await EmbeddingPipeline.getInstance((x) => {
      self.postMessage({ status: 'progress', data: x });
    });

    if (type === 'embed') {
      const output = await extractor(text, { pooling: 'mean', normalize: true });
      self.postMessage({ status: 'complete', id, output: Array.from(output.data) });
    } else if (type === 'embedBatch') {
      const output = await extractor(texts, { pooling: 'mean', normalize: true });
      self.postMessage({ status: 'complete', id, output: output.tolist() });
    }
  } catch (err: any) {
    self.postMessage({ status: 'error', id, error: err.message });
  }
});
