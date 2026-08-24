import { Component, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import * as pdfjsLib from 'pdfjs-dist';

try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
} catch (e) {}

export interface RenderedPageImage {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-pdf-to-image',
  templateUrl: './pdf-to-image.component.html'
})
export class PdfToImageComponent {
  fileList: NzUploadFile[] = [];
  pdfFile: File | null = null;
  totalPages = 0;
  processing = false;
  progressPercent = 0;

  // Options
  format: 'image/jpeg' | 'image/png' = 'image/jpeg';
  quality: number = 0.92;
  scaleFactor: number = 2.0; // 2.0 = High DPI (~150-200 DPI)

  // Rendered Output
  renderedImages: RenderedPageImage[] = [];

  constructor(
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef
  ) {}

  beforeUpload = (file: NzUploadFile): boolean => {
    const raw = (file as any).originFileObj || file;
    this.onSelectFile(raw as File);
    return false;
  };

  onPdf(e: any) {
    const file = e.target.files?.[0];
    if (file) {
      this.onSelectFile(file);
    }
  }

  async onSelectFile(file: File) {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      this.msg.warning('Please select a valid PDF file.');
      return;
    }
    this.pdfFile = file;
    this.renderedImages = [];

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer.slice(0) }).promise;
      this.totalPages = pdf.numPages;
      this.msg.success(`Loaded "${file.name}" (${this.totalPages} pages)`);
    } catch (e) {
      console.error(e);
      this.msg.error('Failed to read PDF document.');
    }
  }

  async process() {
    if (!this.pdfFile) return;
    this.processing = true;
    this.renderedImages = [];
    this.progressPercent = 0;

    try {
      const buffer = await this.pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const total = pdf.numPages;
      const images: RenderedPageImage[] = [];

      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: this.scaleFactor });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context!, viewport }).promise;

        const dataUrl = canvas.toDataURL(this.format, this.quality);
        images.push({
          pageNumber: i,
          dataUrl,
          width: Math.round(viewport.width),
          height: Math.round(viewport.height)
        });

        this.progressPercent = Math.round((i / total) * 100);
        this.cdr.detectChanges();
      }

      this.renderedImages = images;
      this.msg.success(`Successfully converted ${total} pages to ${this.format === 'image/jpeg' ? 'JPEG' : 'PNG'}!`);
    } catch (err) {
      console.error(err);
      this.msg.error('Failed to convert PDF pages to images.');
    } finally {
      this.processing = false;
      this.cdr.detectChanges();
    }
  }

  downloadImage(img: RenderedPageImage) {
    const ext = this.format === 'image/jpeg' ? 'jpg' : 'png';
    const link = document.createElement('a');
    link.href = img.dataUrl;
    link.download = `${this.pdfFile?.name.replace('.pdf', '')}_page_${img.pageNumber}.${ext}`;
    link.click();
  }

  downloadAll() {
    this.renderedImages.forEach((img, idx) => {
      setTimeout(() => this.downloadImage(img), idx * 250);
    });
    this.msg.info(`Downloading ${this.renderedImages.length} images...`);
  }
}

