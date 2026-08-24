import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { PDFDocument } from 'pdf-lib';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import * as pdfjsLib from 'pdfjs-dist';
import { StoreBlobFile } from '../../pdf-rotate/actions/pdf-rotate.actions';

try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
} catch (e) {}

export interface ExtractPageTile {
  pageNumber: number; // 1-based
  thumbnailUrl: string | null;
  selected: boolean;
}

@Component({
  selector: 'app-extract',
  templateUrl: './extract.component.html',
  styleUrls: ['./extract.component.css']
})
export class ExtractComponent {
  fileList: NzUploadFile[] = [];
  fileName = '';
  fileSize = 0;
  originalBuffer: ArrayBuffer | null = null;
  pages: ExtractPageTile[] = [];
  loading = false;
  extracting = false;

  mode: 'select' | 'range' | 'custom' = 'select';
  rangeStart = 1;
  rangeEnd = 1;
  customPagesInput = '';

  extractedBlobUrl: string | null = null;
  extractedBase64: string | null = null;
  extractedPageCount = 0;

  constructor(
    private msg: NzMessageService,
    private store: Store,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  beforeUpload = (file: NzUploadFile): boolean => {
    const raw = (file as any).originFileObj || file;
    this.loadPDF(raw as File);
    return false;
  };

  async loadPDF(file: File) {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      this.msg.warning('Please select a valid PDF file.');
      return;
    }

    this.loading = true;
    this.fileName = file.name;
    this.fileSize = file.size;
    this.pages = [];
    this.extractedBlobUrl = null;

    try {
      this.originalBuffer = await file.arrayBuffer();
      const pdfJsDoc = await pdfjsLib.getDocument({ data: this.originalBuffer.slice(0) }).promise;
      const numPages = pdfJsDoc.numPages;
      this.rangeStart = 1;
      this.rangeEnd = numPages;

      const tiles: ExtractPageTile[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfJsDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.35 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context!, viewport }).promise;
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);

        tiles.push({
          pageNumber: i,
          thumbnailUrl,
          selected: i === 1 // select page 1 by default
        });
      }

      this.pages = tiles;
      this.msg.success(`Loaded ${numPages} pages from "${file.name}"`);
    } catch (err) {
      console.error(err);
      this.msg.error('Failed to load PDF pages.');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  togglePage(index: number) {
    this.pages[index].selected = !this.pages[index].selected;
    this.extractedBlobUrl = null;
  }

  selectAll() {
    this.pages.forEach(p => p.selected = true);
    this.extractedBlobUrl = null;
  }

  selectNone() {
    this.pages.forEach(p => p.selected = false);
    this.extractedBlobUrl = null;
  }

  selectOdd() {
    this.pages.forEach(p => p.selected = (p.pageNumber % 2 !== 0));
    this.extractedBlobUrl = null;
  }

  selectEven() {
    this.pages.forEach(p => p.selected = (p.pageNumber % 2 === 0));
    this.extractedBlobUrl = null;
  }

  applyRangeSelection() {
    this.pages.forEach(p => {
      p.selected = (p.pageNumber >= this.rangeStart && p.pageNumber <= this.rangeEnd);
    });
    this.extractedBlobUrl = null;
  }

  applyCustomSelection() {
    if (!this.customPagesInput.trim()) return;
    const targets = new Set<number>();
    const parts = this.customPagesInput.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(n => parseInt(n.trim(), 10));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
            if (i >= 1 && i <= this.pages.length) targets.add(i);
          }
        }
      } else {
        const num = parseInt(trimmed, 10);
        if (!isNaN(num) && num >= 1 && num <= this.pages.length) {
          targets.add(num);
        }
      }
    }

    this.pages.forEach(p => p.selected = targets.has(p.pageNumber));
    this.extractedBlobUrl = null;
  }

  getSelectedCount(): number {
    return this.pages.filter(p => p.selected).length;
  }

  async extractSelectedPages() {
    if (!this.originalBuffer) return;

    const selectedIndices = this.pages
      .filter(p => p.selected)
      .map(p => p.pageNumber - 1);

    if (selectedIndices.length === 0) {
      this.msg.warning('Please select at least 1 page to extract.');
      return;
    }

    this.extracting = true;
    try {
      const srcDoc = await PDFDocument.load(this.originalBuffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();

      const copiedPages = await newDoc.copyPages(srcDoc, selectedIndices);
      copiedPages.forEach(p => newDoc.addPage(p));

      const outBytes = await newDoc.save({ useObjectStreams: true });
      const blob = new Blob([outBytes], { type: 'application/pdf' });
      this.extractedBlobUrl = URL.createObjectURL(blob);
      this.extractedBase64 = await newDoc.saveAsBase64({ dataUri: true });
      this.extractedPageCount = newDoc.getPageCount();

      this.msg.success(`Extracted ${this.extractedPageCount} pages into new document!`);
    } catch (err) {
      console.error(err);
      this.msg.error('Failed to extract pages.');
    } finally {
      this.extracting = false;
      this.cdr.detectChanges();
    }
  }

  download() {
    if (!this.extractedBlobUrl) return;
    const a = document.createElement('a');
    a.href = this.extractedBlobUrl;
    a.download = this.fileName.replace('.pdf', '_extracted.pdf');
    a.click();
  }

  openInEditor() {
    if (!this.extractedBase64) return;
    this.store.dispatch(new StoreBlobFile(this.extractedBase64));
    this.router.navigate(['/pdf-rotate/editor']);
  }
}

