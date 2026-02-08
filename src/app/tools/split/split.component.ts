import { Component } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';

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
  generatedFiles: { name: string; pages: string; size: number }[] = [];

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
    this.totalPages = Math.floor(Math.random() * 50) + 10;
    this.options.endPage = this.totalPages;
    return false;
  }

  onSplit(): void {
    if (this.fileList.length === 0) {
      return;
    }

    this.splitting = true;
    this.splitProgress = 0;
    this.generatedFiles = [];

    const interval = setInterval(() => {
      this.splitProgress += 10;
      if (this.splitProgress >= 100) {
        clearInterval(interval);
        this.splitting = false;
        this.splitComplete = true;
        this.generateSplitFiles();
      }
    }, 200);
  }

  private generateSplitFiles(): void {
    this.generatedFiles = [];

    if (this.options.mode === 'range') {
      this.generatedFiles.push({
        name: `pages-${this.options.startPage}-to-${this.options.endPage}.pdf`,
        pages: `${this.options.startPage}-${this.options.endPage}`,
        size: Math.floor(Math.random() * 1000000) + 100000
      });
    } else if (this.options.mode === 'every') {
      const numFiles = Math.ceil(this.totalPages / this.options.everyNPages);
      for (let i = 0; i < numFiles; i++) {
        const start = i * this.options.everyNPages + 1;
        const end = Math.min((i + 1) * this.options.everyNPages, this.totalPages);
        this.generatedFiles.push({
          name: `part-${i + 1}-pages-${start}-${end}.pdf`,
          pages: `${start}-${end}`,
          size: Math.floor(Math.random() * 500000) + 100000
        });
      }
    } else if (this.options.mode === 'extract') {
      this.generatedFiles.push({
        name: 'extracted-pages.pdf',
        pages: this.options.extractPages,
        size: Math.floor(Math.random() * 800000) + 100000
      });
    }
  }

  onDownloadAll(): void {
    alert(`Downloading ${this.generatedFiles.length} files as ZIP archive...`);
  }

  onDownload(file: any): void {
    const link = document.createElement('a');
    link.href = '#';
    link.download = file.name;
    link.click();
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
