import type { FileFormatType } from '@/services/FileTypeDetector';

/* ============================================================
   TextExtractor — Extracts plain text from various file formats.
   Uses DYNAMIC IMPORTS so heavy libraries (mammoth, jszip,
   pdfjs-dist) are only loaded when actually needed.
   Everything runs in the browser. No server required.
   ============================================================ */

export class TextExtractor {
  static async extract(file: File, type: FileFormatType): Promise<string> {
    switch (type) {
      case 'pdf':
        return this.extractPDF(file);
      case 'docx':
        return this.extractDOCX(file);
      case 'pptx':
        return this.extractPPTX(file);
      case 'txt':
      case 'md':
      case 'code':
        return file.text();
      default:
        return file.text();
    }
  }

  /* ── PDF (lazy-loaded) ─────────────────────────────────── */
  private static async extractPDF(file: File): Promise<string> {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url,
    ).toString();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items
        .filter((item: any) => 'str' in item)
        .map((item: any) => item.str);
      pages.push(strings.join(' '));
    }

    return pages.join('\n\n');
  }

  /* ── DOCX (lazy-loaded) ────────────────────────────────── */
  private static async extractDOCX(file: File): Promise<string> {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  /* ── PPTX (lazy-loaded) ────────────────────────────────── */
  private static async extractPPTX(file: File): Promise<string> {
    const JSZip = (await import('jszip')).default;
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const slides: string[] = [];

    const slideFiles = Object.keys(zip.files)
      .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)![0]!);
        const numB = parseInt(b.match(/\d+/)![0]!);
        return numA - numB;
      });

    for (const slideFile of slideFiles) {
      const xml = await zip.files[slideFile]!.async('text');
      const textMatches = xml.match(/<a:t[^>]*>([^<]*)<\/a:t>/g);
      if (textMatches) {
        const slideText = textMatches
          .map((match) => match.replace(/<[^>]+>/g, ''))
          .join(' ');
        slides.push(`[Slide ${slides.length + 1}]\n${slideText}`);
      }
    }

    return slides.join('\n\n');
  }
}
