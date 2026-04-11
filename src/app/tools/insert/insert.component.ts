import { Component } from '@angular/core';
import { PDFDocument } from 'pdf-lib';

@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html'
})
export class InsertComponent {
  baseFile: File | null = null;
  insertFile: File | null = null;
  processing = false;

  onBase(e: any) { this.baseFile = e.target.files[0]; }
  onInsert(e: any) { this.insertFile = e.target.files[0]; }

  async process() {
    if (!this.baseFile || !this.insertFile) return;
    this.processing = true;
    try {
      const bBuf = await this.baseFile.arrayBuffer();
      const iBuf = await this.insertFile.arrayBuffer();

      const p1 = await PDFDocument.load(bBuf);
      const p2 = await PDFDocument.load(iBuf);

      const copiedArgs = await p1.copyPages(p2, p2.getPageIndices());
      for (const pg of copiedArgs) { p1.addPage(pg); }

      const out = await p1.save();
      const blob = new Blob([out], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = this.baseFile.name.replace('.pdf', '_inserted.pdf');
      link.click();
    } catch (err) {
      console.error(err);
      alert('Failed to insert PDF');
    } finally {
      this.processing = false;
    }
  }
}
