import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { PDFDocument } from 'pdf-lib';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { StoreBlobFile } from '../../pdf-rotate/actions/pdf-rotate.actions';

export interface MergeQueueItem {
  id: string;
  name: string;
  size: number;
  pageCount: number;
  buffer: ArrayBuffer;
  status: 'ready' | 'processing' | 'done';
}

@Component({
  selector: 'app-merge',
  templateUrl: './merge.component.html',
  styleUrls: ['./merge.component.css']
})
export class MergeComponent {
  queue: MergeQueueItem[] = [];
  merging = false;
  mergedBlobUrl: string | null = null;
  mergedBase64: string | null = null;
  mergedTotalPages = 0;
  mergedFileSize = 0;
  outputFilename = 'merged-document.pdf';

  constructor(
    private msg: NzMessageService,
    private store: Store,
    private router: Router
  ) {}

  beforeUpload = (file: NzUploadFile): boolean => {
    const rawFile = (file as any).originFileObj || file;
    this.addFileToQueue(rawFile as File);
    return false;
  };

  async addFileToQueue(file: File) {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      this.msg.warning(`${file.name} is not a valid PDF file.`);
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pageCount = pdf.getPageCount();

      const item: MergeQueueItem = {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        pageCount,
        buffer,
        status: 'ready'
      };

      this.queue.push(item);
      this.msg.success(`Added "${file.name}" (${pageCount} pages)`);
      this.mergedBlobUrl = null;
    } catch (err) {
      console.error(err);
      this.msg.error(`Could not parse ${file.name}. Ensure it is an unencrypted PDF.`);
    }
  }

  onFilesDropped(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files) {
      const files = Array.from(event.dataTransfer.files);
      files.forEach(f => this.addFileToQueue(f));
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  moveUp(index: number) {
    if (index > 0) {
      const item = this.queue.splice(index, 1)[0];
      this.queue.splice(index - 1, 0, item);
    }
  }

  moveDown(index: number) {
    if (index < this.queue.length - 1) {
      const item = this.queue.splice(index, 1)[0];
      this.queue.splice(index + 1, 0, item);
    }
  }

  remove(index: number) {
    this.queue.splice(index, 1);
  }

  clearQueue() {
    this.queue = [];
    this.mergedBlobUrl = null;
    this.mergedBase64 = null;
  }

  getTotalPages(): number {
    return this.queue.reduce((acc, curr) => acc + curr.pageCount, 0);
  }

  getTotalSize(): number {
    return this.queue.reduce((acc, curr) => acc + curr.size, 0);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  async executeMerge() {
    if (this.queue.length < 2) {
      this.msg.warning('Please add at least 2 PDF documents to merge.');
      return;
    }

    this.merging = true;
    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of this.queue) {
        const srcPdf = await PDFDocument.load(item.buffer, { ignoreEncryption: true });
        const indices = srcPdf.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(srcPdf, indices);
        copiedPages.forEach(p => mergedPdf.addPage(p));
      }

      const mergedBytes = await mergedPdf.save({ useObjectStreams: true });
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      this.mergedBlobUrl = URL.createObjectURL(blob);
      this.mergedBase64 = await mergedPdf.saveAsBase64({ dataUri: true });
      this.mergedTotalPages = mergedPdf.getPageCount();
      this.mergedFileSize = blob.size;

      this.msg.success(`Successfully merged ${this.queue.length} documents into ${this.mergedTotalPages} pages!`);
    } catch (err) {
      console.error('Merge error:', err);
      this.msg.error('An error occurred while merging your PDF files.');
    } finally {
      this.merging = false;
    }
  }

  downloadMerged() {
    if (!this.mergedBlobUrl) return;
    const a = document.createElement('a');
    a.href = this.mergedBlobUrl;
    a.download = this.outputFilename || 'merged-document.pdf';
    a.click();
  }

  openInEditor() {
    if (!this.mergedBase64) return;
    this.store.dispatch(new StoreBlobFile(this.mergedBase64));
    this.router.navigate(['/pdf-rotate/editor']);
  }
}

