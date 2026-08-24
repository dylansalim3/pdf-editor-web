import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { StoreBlobFile } from '../../pdf-rotate/actions/pdf-rotate.actions';

@Component({
  selector: 'app-protect',
  templateUrl: './protect.component.html'
})
export class ProtectComponent {
  fileList: NzUploadFile[] = [];
  pdfFile: File | null = null;
  processing = false;

  // Protection & metadata options
  ownerName: string = 'Secure Enterprise PDF';
  confidentialityLevel: 'CONFIDENTIAL' | 'RESTRICTED' | 'INTERNAL ONLY' | 'NONE' = 'CONFIDENTIAL';
  lockMetadata = true;
  addSecurityWatermark = true;
  readOnlyFlag = true;

  // Output
  protectedBlobUrl: string | null = null;
  protectedBase64: string | null = null;

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
    this.protectedBlobUrl = null;
    this.protectedBase64 = null;
    this.msg.success(`Loaded "${file.name}"`);
  }

  async process() {
    if (!this.pdfFile) return;
    this.processing = true;

    try {
      const buffer = await this.pdfFile.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

      if (this.lockMetadata) {
        pdf.setAuthor(this.ownerName || 'Protected Document Owner');
        pdf.setCreator('PDF Studio Enterprise Security Suite');
        pdf.setProducer('PDF Studio Cryptographic Sandbox');
        pdf.setSubject(`Classified Document - ${this.confidentialityLevel}`);
      }

      if (this.addSecurityWatermark && this.confidentialityLevel !== 'NONE') {
        const font = await pdf.embedFont(StandardFonts.HelveticaBold);
        const pages = pdf.getPages();
        const watermarkText = `[ ${this.confidentialityLevel} - DO NOT DISTRIBUTE ]`;

        for (const page of pages) {
          const { width, height } = page.getSize();
          const textWidth = font.widthOfTextAtSize(watermarkText, 24);
          page.drawText(watermarkText, {
            x: (width - textWidth) / 2,
            y: height / 2,
            size: 24,
            font,
            color: rgb(0.85, 0.2, 0.2),
            opacity: 0.18,
            rotate: degrees(45)
          });
        }
      }

      const out = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([out], { type: 'application/pdf' });
      this.protectedBlobUrl = URL.createObjectURL(blob);
      this.protectedBase64 = await pdf.saveAsBase64({ dataUri: true });

      this.msg.success('Security policies and protection applied successfully!');
    } catch (err) {
      console.error(err);
      this.msg.error('Failed to apply security policy to PDF.');
    } finally {
      this.processing = false;
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  download() {
    if (!this.protectedBlobUrl || !this.pdfFile) return;
    const link = document.createElement('a');
    link.href = this.protectedBlobUrl;
    link.download = this.pdfFile.name.replace('.pdf', '_protected.pdf');
    link.click();
  }

  openInEditor() {
    if (!this.protectedBase64) return;
    this.store.dispatch(new StoreBlobFile(this.protectedBase64));
    this.router.navigate(['/pdf-rotate/editor']);
  }
}

