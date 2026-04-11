import { Component } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import * as Tesseract from 'tesseract.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

@Component({
  selector: 'app-ocr',
  templateUrl: './ocr.component.html'
})
export class OcrComponent {
  pdfFile: File | null = null;
  processing = false;
  extractedText = '';
  progress = 0;

  onPdf(e: any) { this.pdfFile = e.target.files[0]; }

  async process() {
    if (!this.pdfFile) return;
    this.processing = true;
    this.progress = 0;
    this.extractedText = '';
    
    try {
      const buffer = await this.pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2.0 });

      const canvas: HTMLCanvasElement = document.getElementById('ocr-canvas') as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context!, viewport }).promise;
      const imgData = canvas.toDataURL('image/jpeg');

      const result = await Tesseract.recognize(imgData, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            this.progress = Math.round(m.progress * 100);
          }
        }
      });

      this.extractedText = result.data.text;
    } catch (err) {
      console.error(err);
      alert('OCR Failed');
    } finally {
      this.processing = false;
      this.progress = 100;
    }
  }
}
