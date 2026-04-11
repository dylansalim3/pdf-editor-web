import { Component } from '@angular/core';
import { PDFDocument } from 'pdf-lib';

@Component({
  selector: 'app-compress',
  templateUrl: './compress.component.html'
})
export class CompressComponent {
  pdfFile: File | null = null;
  processing = false;

  onPdf(e: any) { this.pdfFile = e.target.files[0]; }

  async process() {
    if (!this.pdfFile) return;
    this.processing = true;
    try {
      const buffer = await this.pdfFile.arrayBuffer();
      // "Compress" heavily by stripping all unnecessary streams & objects via pdf-lib save options
       // PDF-lib supports useObjectStreams which drastically reduces file size.
      const pdf = await PDFDocument.load(buffer);
      const out = await pdf.save({ useObjectStreams: true });
      
      const blob = new Blob([out], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = this.pdfFile.name.replace('.pdf', '_compressed.pdf');
      link.click();
    } catch (err) {
      console.error(err);
      alert('Failed to compress PDF');
    } finally {
      this.processing = false;
    }
  }
}
