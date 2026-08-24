import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { PDFDocument } from 'pdf-lib';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { StoreBlobFile } from '../../pdf-rotate/actions/pdf-rotate.actions';

@Component({
  selector: 'app-compress',
  templateUrl: './compress.component.html'
})
export class CompressComponent {
  fileList: NzUploadFile[] = [];
  pdfFile: File | null = null;
  originalSize = 0;
  compressedSize = 0;
  processing = false;
  compressionProgress = 0;

  // Options
  compressionLevel: 'extreme' | 'recommended' | 'less' = 'recommended';
  stripMetadata = true;
  useObjectStreams = true;

  // Output
  compressedBlobUrl: string | null = null;
  compressedBase64: string | null = null;

  constructor(
    private msg: NzMessageService,
    private store: Store,
    private router: Router
  ) {}

  beforeUpload = (file: NzUploadFile): boolean => {
    const raw = (file as any).originFileObj || file;
    this.onSelectFile(raw as File);
    return false;
  };

  onSelectFile(file: File) {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      this.msg.warning('Please select a valid PDF file.');
      return;
    }
    this.pdfFile = file;
    this.originalSize = file.size;
    this.compressedBlobUrl = null;
    this.compressedBase64 = null;
    this.msg.success(`Loaded "${file.name}" (${this.formatFileSize(file.size)})`);
  }

  async process() {
    if (!this.pdfFile) return;
    this.processing = true;
    this.compressionProgress = 20;

    try {
      const buffer = await this.pdfFile.arrayBuffer();
      this.compressionProgress = 50;

      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

      if (this.stripMetadata) {
        pdf.setTitle('');
        pdf.setAuthor('');
        pdf.setSubject('');
        pdf.setKeywords([]);
        pdf.setProducer('PDF Studio Compression Engine');
        pdf.setCreator('PDF Studio Optimizer');
      }

      this.compressionProgress = 80;

      // Save with object streams which combines streams into compressed cross-reference blocks
      const out = await pdf.save({
        useObjectStreams: this.useObjectStreams,
        addDefaultPage: false,
        updateFieldAppearances: false
      });

      const blob = new Blob([out], { type: 'application/pdf' });
      this.compressedSize = blob.size;
      this.compressedBlobUrl = URL.createObjectURL(blob);
      this.compressedBase64 = await pdf.saveAsBase64({ dataUri: true });
      this.compressionProgress = 100;

      const reduction = this.getSavingsPercent();
      if (reduction > 0) {
        this.msg.success(`PDF optimized! Saved ${reduction}% in file size.`);
      } else {
        this.msg.info('PDF structure optimized with streamlined cross-references.');
      }
    } catch (err) {
      console.error(err);
      this.msg.error('Failed to compress PDF.');
    } finally {
      this.processing = false;
    }
  }

  getSavingsPercent(): number {
    if (this.originalSize === 0 || this.compressedSize === 0) return 0;
    const diff = this.originalSize - this.compressedSize;
    if (diff <= 0) return 0;
    return Math.round((diff / this.originalSize) * 100);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  download() {
    if (!this.compressedBlobUrl || !this.pdfFile) return;
    const link = document.createElement('a');
    link.href = this.compressedBlobUrl;
    link.download = this.pdfFile.name.replace('.pdf', '_optimized.pdf');
    link.click();
  }

  openInEditor() {
    if (!this.compressedBase64) return;
    this.store.dispatch(new StoreBlobFile(this.compressedBase64));
    this.router.navigate(['/pdf-rotate/editor']);
  }
}

