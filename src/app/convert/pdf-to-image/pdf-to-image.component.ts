import { Component } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

// pdfjsLib.GlobalWorkerOptions setup is usually shared, doing it localized here
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

@Component({
  selector: 'app-pdf-to-image',
  templateUrl: './pdf-to-image.component.html'
})
export class PdfToImageComponent {
  pdfFile: File | null = null;
  processing = false;

  onPdf(e: any) { this.pdfFile = e.target.files[0]; }

  async process() {
    if (!this.pdfFile) return;
    this.processing = true;
    try {
      const buffer = await this.pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      
      const page = await pdf.getPage(1); // just convert the first page for this tool
      const viewport = page.getViewport({ scale: 2.0 }); // High quality

      const canvas: HTMLCanvasElement = document.getElementById('pdf-to-image-canvas') as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context!, viewport }).promise;

      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const link = document.createElement('a');
      link.href = imgData;
      link.download = this.pdfFile.name.replace('.pdf', '_page1.jpg');
      link.click();
    } catch (err) {
      console.error(err);
      alert('Failed to convert PDF to Image');
    } finally {
      this.processing = false;
    }
  }
}
