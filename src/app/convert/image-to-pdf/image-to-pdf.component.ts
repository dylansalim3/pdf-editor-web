import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { StoreBlobFile } from '../../pdf-rotate/actions/pdf-rotate.actions';

export interface ImageQueueItem {
  id: string;
  name: string;
  size: number;
  dataUrl: string;
  file: File;
}

@Component({
  selector: 'app-image-to-pdf',
  templateUrl: './image-to-pdf.component.html'
})
export class ImageToPdfComponent {
  images: ImageQueueItem[] = [];
  processing = false;

  // Options
  pageSize: 'auto' | 'a4' | 'letter' = 'a4';
  orientation: 'auto' | 'portrait' | 'landscape' = 'portrait';
  margin: number = 20; // in points

  // Output
  pdfBlobUrl: string | null = null;
  pdfBase64: string | null = null;
  outputFilename = 'compiled-images.pdf';

  constructor(
    private msg: NzMessageService,
    private store: Store,
    private router: Router
  ) {}

  beforeUpload = (file: NzUploadFile): boolean => {
    const raw = (file as any).originFileObj || file;
    this.addImage(raw as File);
    return false;
  };

  addImage(file: File) {
    if (!file.type.startsWith('image/')) {
      this.msg.warning(`${file.name} is not a supported image.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.images.push({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        dataUrl: reader.result as string,
        file
      });
      this.pdfBlobUrl = null;
    };
    reader.readAsDataURL(file);
  }

  onImages(e: any) {
    const files = Array.from(e.target.files) as File[];
    files.forEach(f => this.addImage(f));
  }

  moveUp(index: number) {
    if (index > 0) {
      const item = this.images.splice(index, 1)[0];
      this.images.splice(index - 1, 0, item);
      this.pdfBlobUrl = null;
    }
  }

  moveDown(index: number) {
    if (index < this.images.length - 1) {
      const item = this.images.splice(index, 1)[0];
      this.images.splice(index + 1, 0, item);
      this.pdfBlobUrl = null;
    }
  }

  remove(index: number) {
    this.images.splice(index, 1);
    this.pdfBlobUrl = null;
  }

  clear() {
    this.images = [];
    this.pdfBlobUrl = null;
    this.pdfBase64 = null;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  async process() {
    if (this.images.length === 0) return;
    this.processing = true;

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of this.images) {
        const bytes = await item.file.arrayBuffer();
        let embeddedImg;

        if (item.file.type === 'image/jpeg' || item.name.toLowerCase().endsWith('.jpg') || item.name.toLowerCase().endsWith('.jpeg')) {
          embeddedImg = await pdfDoc.embedJpg(bytes);
        } else if (item.file.type === 'image/png' || item.name.toLowerCase().endsWith('.png')) {
          embeddedImg = await pdfDoc.embedPng(bytes);
        } else {
          // For other formats (webp, etc.), draw onto offscreen canvas and convert to PNG
          const img = new Image();
          img.src = item.dataUrl;
          await new Promise(r => img.onload = r);
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          const pngDataUrl = canvas.toDataURL('image/png');
          const binary = atob(pngDataUrl.split(',')[1]);
          const pngBytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) pngBytes[i] = binary.charCodeAt(i);
          embeddedImg = await pdfDoc.embedPng(pngBytes);
        }

        const imgWidth = embeddedImg.width;
        const imgHeight = embeddedImg.height;

        let pageWidth = PageSizes.A4[0];
        let pageHeight = PageSizes.A4[1];

        if (this.pageSize === 'letter') {
          pageWidth = PageSizes.Letter[0];
          pageHeight = PageSizes.Letter[1];
        } else if (this.pageSize === 'auto') {
          pageWidth = imgWidth + (this.margin * 2);
          pageHeight = imgHeight + (this.margin * 2);
        }

        if (this.orientation === 'landscape' && this.pageSize !== 'auto') {
          const temp = pageWidth;
          pageWidth = pageHeight;
          pageHeight = temp;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        const availWidth = pageWidth - (this.margin * 2);
        const availHeight = pageHeight - (this.margin * 2);

        const scale = Math.min(availWidth / imgWidth, availHeight / imgHeight, 1.0);
        const drawWidth = imgWidth * scale;
        const drawHeight = imgHeight * scale;

        const x = this.margin + (availWidth - drawWidth) / 2;
        const y = this.margin + (availHeight - drawHeight) / 2;

        page.drawImage(embeddedImg, {
          x,
          y,
          width: drawWidth,
          height: drawHeight
        });
      }

      const out = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([out], { type: 'application/pdf' });
      this.pdfBlobUrl = URL.createObjectURL(blob);
      this.pdfBase64 = await pdfDoc.saveAsBase64({ dataUri: true });

      this.msg.success(`Compiled ${this.images.length} images into PDF successfully!`);
    } catch (err) {
      console.error(err);
      this.msg.error('Failed to convert images to PDF.');
    } finally {
      this.processing = false;
    }
  }

  download() {
    if (!this.pdfBlobUrl) return;
    const link = document.createElement('a');
    link.href = this.pdfBlobUrl;
    link.download = this.outputFilename || 'converted_images.pdf';
    link.click();
  }

  openInEditor() {
    if (!this.pdfBase64) return;
    this.store.dispatch(new StoreBlobFile(this.pdfBase64));
    this.router.navigate(['/pdf-rotate/editor']);
  }
}

