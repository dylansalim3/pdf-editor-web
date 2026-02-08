import { Component } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';

interface CompressOptions {
  quality: 'low' | 'medium' | 'high';
  optimizeImages: boolean;
  removeMetadata: boolean;
  compressFonts: boolean;
  targetSize: number | null;
}

@Component({
  selector: 'app-compress',
  templateUrl: './compress.component.html',
  styleUrls: ['./compress.component.css']
})
export class CompressComponent {
  fileList: NzUploadFile[] = [];
  compressing = false;
  compressProgress = 0;
  compressed = false;

  originalSize = 0;
  compressedSize = 0;
  originalPages = 0;

  options: CompressOptions = {
    quality: 'medium',
    optimizeImages: true,
    removeMetadata: true,
    compressFonts: true,
    targetSize: null
  };

  qualityOptions = [
    { value: 'low', label: 'Low', description: 'Smallest file size, lower quality', reduction: '70-80%' },
    { value: 'medium', label: 'Medium', description: 'Balanced size and quality', reduction: '50-60%' },
    { value: 'high', label: 'High', description: 'Best quality, moderate compression', reduction: '30-40%' }
  ];

  beforeUpload = (file: NzUploadFile): boolean => {
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    if (!isPdf) {
      return false;
    }

    this.fileList = [file];
    this.originalSize = file.size || 0;
    this.originalPages = Math.floor(Math.random() * 50) + 5;
    return false;
  }

  onCompress(): void {
    if (this.fileList.length === 0) {
      return;
    }

    this.compressing = true;
    this.compressProgress = 0;

    const interval = setInterval(() => {
      this.compressProgress += 5;
      if (this.compressProgress >= 100) {
        clearInterval(interval);
        this.compressing = false;
        this.compressed = true;
        this.calculateCompressedSize();
      }
    }, 150);
  }

  private calculateCompressedSize(): void {
    const reductions: { [key: string]: number } = {
      low: 0.75,
      medium: 0.55,
      high: 0.35
    };

    const reduction = reductions[this.options.quality] || 0.5;
    this.compressedSize = Math.floor(this.originalSize * (1 - reduction));
  }

  getCompressionRatio(): number {
    if (this.originalSize === 0) {
      return 0;
    }
    return Math.round(((this.originalSize - this.compressedSize) / this.originalSize) * 100);
  }

  onDownload(): void {
    const link = document.createElement('a');
    link.href = '#';
    link.download = this.fileList[0].name.replace('.pdf', '-compressed.pdf');
    link.click();
  }

  onReset(): void {
    this.fileList = [];
    this.compressed = false;
    this.compressProgress = 0;
    this.originalSize = 0;
    this.compressedSize = 0;
    this.originalPages = 0;
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
