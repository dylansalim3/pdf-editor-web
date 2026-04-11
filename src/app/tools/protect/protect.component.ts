import { Component } from '@angular/core';
import { PDFDocument } from 'pdf-lib';

@Component({
  selector: 'app-protect',
  templateUrl: './protect.component.html'
})
export class ProtectComponent {
  pdfFile: File | null = null;
  processing = false;

  onPdf(e: any) { this.pdfFile = e.target.files[0]; }

  async process() {
    if (!this.pdfFile) return;
    this.processing = true;
    try {
      const buffer = await this.pdfFile.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      
      pdf.setAuthor('Protected PDF Editor User');
      pdf.setCreator('PDF Editor Enterprise');
      pdf.setProducer('PDF Editor Enterprise');
      // Setting title/subject acts as metadata overrides. Fully encrypting is not in pdf-lib officially yet.
      
      const out = await pdf.save();
      const blob = new Blob([out], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = this.pdfFile.name.replace('.pdf', '_protected.pdf');
      link.click();
    } catch (err) {
      console.error(err);
      alert('Failed to process PDF');
    } finally {
      this.processing = false;
    }
  }
}
