import { Component } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';

interface ConversionOptions {
  outputFormat: 'docx' | 'doc';
  preserveLayout: boolean;
  extractImages: boolean;
  useOcr: boolean;
  ocrLanguage: string;
  includeHeadersFooters: boolean;
  preserveHyperlinks: boolean;
}

@Component({
  selector: 'app-pdf-to-word',
  templateUrl: './pdf-to-word.component.html',
  styleUrls: ['./pdf-to-word.component.css']
})
export class PdfToWordComponent {
  fileList: NzUploadFile[] = [];
  converting = false;
  conversionProgress = 0;
  converted = false;
  convertedFile: { name: string; size: number; pages: number } | null = null;
  extractedText: string = '';
  showPreview = false;
  
  options: ConversionOptions = {
    outputFormat: 'docx',
    preserveLayout: true,
    extractImages: true,
    useOcr: false,
    ocrLanguage: 'eng',
    includeHeadersFooters: true,
    preserveHyperlinks: true
  };

  ocrLanguages = [
    { value: 'eng', label: 'English' },
    { value: 'spa', label: 'Spanish' },
    { value: 'fra', label: 'French' },
    { value: 'deu', label: 'German' },
    { value: 'ita', label: 'Italian' },
    { value: 'por', label: 'Portuguese' },
    { value: 'rus', label: 'Russian' },
    { value: 'chi_sim', label: 'Chinese (Simplified)' },
    { value: 'chi_tra', label: 'Chinese (Traditional)' },
    { value: 'jpn', label: 'Japanese' },
    { value: 'kor', label: 'Korean' },
    { value: 'ara', label: 'Arabic' },
  ];

  beforeUpload = (file: NzUploadFile): boolean => {
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    
    if (!isPdf) {
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
      this.conversionProgress += 5;
      if (this.conversionProgress >= 100) {
        clearInterval(interval);
        this.converting = false;
        this.converted = true;
        this.convertedFile = {
          name: this.fileList[0].name.replace(/\.pdf$/i, `.${this.options.outputFormat}`),
          size: Math.floor(Math.random() * 1000000) + 200000,
          pages: Math.floor(Math.random() * 20) + 5
        };
        
        // Generate sample extracted text
        this.extractedText = this.generateSampleText();
      }
    }, 200);
  }

  private generateSampleText(): string {
    return `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
  }

  onDownload(): void {
    const link = document.createElement('a');
    link.href = '#';
    link.download = this.convertedFile?.name || 'converted.docx';
    link.click();
  }

  onReset(): void {
    this.fileList = [];
    this.converted = false;
    this.convertedFile = null;
    this.conversionProgress = 0;
    this.extractedText = '';
    this.showPreview = false;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.extractedText).then(() => {
      // Show success toast (simplified)
      alert('Text copied to clipboard!');
    });
  }
}
