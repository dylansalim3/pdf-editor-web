import { Component } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';

interface ConversionOptions {
  pageSize: 'A4' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  imageQuality: 'low' | 'medium' | 'high';
  embedFonts: boolean;
  preserveLinks: boolean;
  preserveComments: boolean;
  minimizeSize: boolean;
}

@Component({
  selector: 'app-word-to-pdf',
  templateUrl: './word-to-pdf.component.html',
  styleUrls: ['./word-to-pdf.component.css']
})
export class WordToPdfComponent {
  fileList: NzUploadFile[] = [];
  converting = false;
  conversionProgress = 0;
  converted = false;
  convertedFile: { name: string; size: number; pages: number } | null = null;
  
  options: ConversionOptions = {
    pageSize: 'A4',
    orientation: 'portrait',
    imageQuality: 'high',
    embedFonts: true,
    preserveLinks: true,
    preserveComments: false,
    minimizeSize: false
  };

  beforeUpload = (file: NzUploadFile): boolean => {
    const isDoc = file.type === 'application/msword' || 
                  file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const isDocx = file.name.endsWith('.doc') || file.name.endsWith('.docx');
    
    if (!isDoc && !isDocx) {
      return false;
    }
    
    this.fileList = [file];
    return false;
  };

  onConvert(): void {
    if (this.fileList.length === 0) return;
    
    this.converting = true;
    this.conversionProgress = 0;
    
    // Simulate conversion progress
    const interval = setInterval(() => {
      this.conversionProgress += 10;
      if (this.conversionProgress >= 100) {
        clearInterval(interval);
        this.converting = false;
        this.converted = true;
        this.convertedFile = {
          name: this.fileList[0].name.replace(/\.docx?$/, '.pdf'),
          size: Math.floor(Math.random() * 2000000) + 500000,
          pages: Math.floor(Math.random() * 20) + 5
        };
      }
    }, 300);
  }

  onDownload(): void {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = this.convertedFile?.name || 'converted.pdf';
    link.click();
  }

  onReset(): void {
    this.fileList = [];
    this.converted = false;
    this.convertedFile = null;
    this.conversionProgress = 0;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
