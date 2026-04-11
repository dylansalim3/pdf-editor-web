import { Component } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { PDFDocument } from 'pdf-lib';

interface SplitOptions {
  mode: 'range' | 'every' | 'extract';
  startPage: number;
  endPage: number;
  everyNPages: number;
  extractPages: string;
  customNames: boolean;
  namePattern: string;
}

@Component({
  selector: 'app-split',
  templateUrl: './split.component.html',
  styleUrls: ['./split.component.css']
})
export class SplitComponent {
  fileList: NzUploadFile[] = [];
  splitting = false;
  splitProgress = 0;
  splitComplete = false;
  totalPages = 0;
  Math = Math;
  generatedFiles: { name: string; pages: string; size: number; data: Uint8Array }[] = [];

  options: SplitOptions = {
    mode: 'range',
    startPage: 1,
    endPage: 1,
    everyNPages: 1,
    extractPages: '',
    customNames: false,
    namePattern: 'document-part-{n}.pdf'
  };

  beforeUpload = (file: NzUploadFile): boolean => {
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    if (!isPdf) {
      return false;
    }

    this.fileList = [file];
    
    const originFile = (file as any).originFileObj || file;
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      try {
        const arrayBuffer = e.target.result;
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        this.totalPages = pdfDoc.getPageCount();
        this.options.endPage = this.totalPages;
      } catch (err) {
        console.error('Error loading PDF preview:', err);
      }
    };
    reader.readAsArrayBuffer(originFile as Blob);
    
    return false;
  }

  async onSplit(): Promise<void> {
    if (this.fileList.length === 0) {
      return;
    }

    this.splitting = true;
    this.splitProgress = 0;
    this.generatedFiles = [];

    try {
      const file = this.fileList[0] as any;
      const originFile = file.originFileObj || file;
      
      // We will read using arrayBuffer if supported, else fallback to FileReader
      let arrayBuffer: ArrayBuffer;
      if (originFile.arrayBuffer) {
        arrayBuffer = await originFile.arrayBuffer();
      } else {
        arrayBuffer = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = e => resolve(e.target?.result as ArrayBuffer);
          reader.onerror = e => reject(e);
          reader.readAsArrayBuffer(originFile);
        });
      }

      this.splitProgress = 10;
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const total = pdfDoc.getPageCount();
      this.splitProgress = 30;

      if (this.options.mode === 'range') {
        await this.extractRange(pdfDoc, this.options.startPage, this.options.endPage);
        this.splitProgress = 100;
      } else if (this.options.mode === 'every') {
        const numFiles = Math.ceil(total / this.options.everyNPages);
        for (let i = 0; i < numFiles; i++) {
          const start = i * this.options.everyNPages + 1;
          const end = Math.min((i + 1) * this.options.everyNPages, total);
          await this.extractRange(pdfDoc, start, end, `part-${i + 1}-pages-${start}-${end}.pdf`);
          this.splitProgress = 30 + Math.round(((i + 1) / numFiles) * 70);
        }
      } else if (this.options.mode === 'extract') {
        await this.extractCustom(pdfDoc, this.options.extractPages);
        this.splitProgress = 100;
      }
      
      this.splitComplete = true;
    } catch (e) {
      console.error(e);
      alert('Error splitting PDF');
    } finally {
      this.splitting = false;
    }
  }

  private async extractRange(sourcePdf: PDFDocument, start: number, end: number, customName?: string): Promise<void> {
    const newPdf = await PDFDocument.create();
    const pageIndices: number[] = [];
    for (let i = start - 1; i < end; i++) {
      if (i >= 0 && i < sourcePdf.getPageCount()) {
        pageIndices.push(i);
      }
    }
    
    if (pageIndices.length === 0) return;

    const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
    for (const page of copiedPages) {
      newPdf.addPage(page);
    }
    
    const pdfBytes = await newPdf.save();
    this.generatedFiles.push({
      name: customName || `pages-${start}-to-${end}.pdf`,
      pages: `${start}-${end}`,
      size: pdfBytes.length,
      data: pdfBytes
    });
  }

  private async extractCustom(sourcePdf: PDFDocument, pagesStr: string): Promise<void> {
    const newPdf = await PDFDocument.create();
    const pageIndices: number[] = [];
    
    const parts = pagesStr.split(',');
    for (const part of parts) {
      const range = part.trim().split('-');
      if (range.length === 2) {
        const start = parseInt(range[0], 10);
        const end = parseInt(range[1], 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start - 1; i < end; i++) pageIndices.push(i);
        }
      } else {
        const page = parseInt(part.trim(), 10);
        if (!isNaN(page)) pageIndices.push(page - 1);
      }
    }
    
    const validIndices = pageIndices.filter(i => i >= 0 && i < sourcePdf.getPageCount());
    if (validIndices.length === 0) return;

    const copiedPages = await newPdf.copyPages(sourcePdf, validIndices);
    for (const page of copiedPages) {
      newPdf.addPage(page);
    }
    
    const pdfBytes = await newPdf.save();
    this.generatedFiles.push({
      name: 'extracted-pages.pdf',
      pages: pagesStr,
      size: pdfBytes.length,
      data: pdfBytes
    });
  }

  onDownloadAll(): void {
    // Download them sequentially using an interval to avoid browser blocking multiple downloads
    let i = 0;
    const interval = setInterval(() => {
      if (i < this.generatedFiles.length) {
        this.onDownload(this.generatedFiles[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 500);
  }

  onDownload(file: any): void {
    const blob = new Blob([file.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  onReset(): void {
    this.fileList = [];
    this.splitComplete = false;
    this.splitProgress = 0;
    this.generatedFiles = [];
    this.totalPages = 0;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
