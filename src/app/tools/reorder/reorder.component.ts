import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { PDFDocument, degrees } from 'pdf-lib';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import * as pdfjsLib from 'pdfjs-dist';
import { StoreBlobFile } from '../../pdf-rotate/actions/pdf-rotate.actions';

// Ensure worker is configured
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
} catch (e) {}

export interface PageTile {
  id: string;
  originalIndex: number; // 0-based
  currentRotation: number; // in degrees: 0, 90, 180, 270
  thumbnailUrl: string | null;
}

@Component({
  selector: 'app-reorder',
  templateUrl: './reorder.component.html',
  styleUrls: ['./reorder.component.css']
})
export class ReorderComponent {
  fileList: NzUploadFile[] = [];
  fileName = '';
  fileSize = 0;
  originalBuffer: ArrayBuffer | null = null;
  pages: PageTile[] = [];
  loading = false;
  saving = false;
  draggedIndex: number | null = null;

  exportedBlobUrl: string | null = null;
  exportedBase64: string | null = null;

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
    this.exportedBlobUrl = null;

    try {
      this.originalBuffer = await file.arrayBuffer();
      const pdfJsDoc = await pdfjsLib.getDocument({ data: this.originalBuffer.slice(0) }).promise;
      const numPages = pdfJsDoc.numPages;

      const newPages: PageTile[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfJsDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context!, viewport }).promise;
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);

        newPages.push({
          id: `page-${i}-${Math.random().toString(36).substring(2, 6)}`,
          originalIndex: i - 1,
          currentRotation: 0,
          thumbnailUrl
        });
      }

      this.pages = newPages;
      this.msg.success(`Loaded ${numPages} pages from "${file.name}"`);
    } catch (err) {
      console.error(err);
      this.msg.error('Failed to load and render PDF pages.');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  moveLeft(index: number) {
    if (index > 0) {
      const item = this.pages.splice(index, 1)[0];
      this.pages.splice(index - 1, 0, item);
      this.exportedBlobUrl = null;
    }
  }

  moveRight(index: number) {
    if (index < this.pages.length - 1) {
      const item = this.pages.splice(index, 1)[0];
      this.pages.splice(index + 1, 0, item);
      this.exportedBlobUrl = null;
    }
  }

  moveToStart(index: number) {
    if (index > 0) {
      const item = this.pages.splice(index, 1)[0];
      this.pages.unshift(item);
      this.exportedBlobUrl = null;
    }
  }

  moveToEnd(index: number) {
    if (index < this.pages.length - 1) {
      const item = this.pages.splice(index, 1)[0];
      this.pages.push(item);
      this.exportedBlobUrl = null;
    }
  }

  rotatePage(index: number) {
    this.pages[index].currentRotation = (this.pages[index].currentRotation + 90) % 360;
    this.exportedBlobUrl = null;
  }

  deletePage(index: number) {
    if (this.pages.length <= 1) {
      this.msg.warning('Document must contain at least 1 page.');
      return;
    }
    this.pages.splice(index, 1);
    this.exportedBlobUrl = null;
  }

  reverseOrder() {
    this.pages.reverse();
    this.exportedBlobUrl = null;
    this.msg.info('Reversed page sequence');
  }

  resetOrder() {
    this.pages.sort((a, b) => a.originalIndex - b.originalIndex);
    this.pages.forEach(p => p.currentRotation = 0);
    this.exportedBlobUrl = null;
    this.msg.info('Reset to original order');
  }

  onDragStart(index: number) {
    this.draggedIndex = index;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(targetIndex: number) {
    if (this.draggedIndex !== null && this.draggedIndex !== targetIndex) {
      const item = this.pages.splice(this.draggedIndex, 1)[0];
      this.pages.splice(targetIndex, 0, item);
      this.exportedBlobUrl = null;
    }
    this.draggedIndex = null;
  }

  async exportPDF() {
    if (!this.originalBuffer || this.pages.length === 0) return;

    this.saving = true;
    try {
      const srcDoc = await PDFDocument.load(this.originalBuffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();

      const originalIndices = this.pages.map(p => p.originalIndex);
      const copiedPages = await newDoc.copyPages(srcDoc, originalIndices);

      copiedPages.forEach((page, i) => {
        const rotationAngle = this.pages[i].currentRotation;
        if (rotationAngle !== 0) {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + rotationAngle));
        }
        newDoc.addPage(page);
      });

      const outBytes = await newDoc.save({ useObjectStreams: true });
      const blob = new Blob([outBytes], { type: 'application/pdf' });
      this.exportedBlobUrl = URL.createObjectURL(blob);
      this.exportedBase64 = await newDoc.saveAsBase64({ dataUri: true });

      this.msg.success(`Reordered PDF exported successfully (${this.pages.length} pages)`);
    } catch (err) {
      console.error(err);
      this.msg.error('Failed to export reordered PDF.');
    } finally {
      this.saving = false;
      this.cdr.detectChanges();
    }
  }

  download() {
    if (!this.exportedBlobUrl) return;
    const a = document.createElement('a');
    a.href = this.exportedBlobUrl;
    a.download = this.fileName.replace('.pdf', '_reordered.pdf');
    a.click();
  }

  openInEditor() {
    if (!this.exportedBase64) return;
    this.store.dispatch(new StoreBlobFile(this.exportedBase64));
    this.router.navigate(['/pdf-rotate/editor']);
  }
}

