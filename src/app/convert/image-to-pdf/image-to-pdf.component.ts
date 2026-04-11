import { Component } from '@angular/core';
import { PDFDocument } from 'pdf-lib';

@Component({
  selector: 'app-image-to-pdf',
  templateUrl: './image-to-pdf.component.html'
})
export class ImageToPdfComponent {
  images: File[] = [];
  processing = false;

  onImages(e: any) { this.images = Array.from(e.target.files); }

  async process() {
    if (this.images.length === 0) return;
    this.processing = true;
    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of this.images) {
        const bytes = await file.arrayBuffer();
        let image;
        if (file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')) {
          image = await pdfDoc.embedJpg(bytes);
        } else if (file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')) {
          image = await pdfDoc.embedPng(bytes);
        } else {
          continue; // skip unsupported
        }

        const dims = image.scale(1);
        const page = pdfDoc.addPage([dims.width, dims.height]);
        page.drawImage(image, { x: 0, y: 0, width: dims.width, height: dims.height });
      }

      const out = await pdfDoc.save();
      const blob = new Blob([out], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'converted_images.pdf';
      link.click();
    } catch (err) {
      console.error(err);
      alert('Failed to convert images');
    } finally {
      this.processing = false;
    }
  }
}
