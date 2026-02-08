import { Component } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';

interface TextExtractionOptions {
  extractionMode: 'all' | 'pages' | 'range';
  startPage: number;
  endPage: number;
  specificPages: string;
  preserveLineBreaks: boolean;
  includePageNumbers: boolean;
  useOcr: boolean;
  ocrLanguage: string;
  outputFormat: 'txt' | 'json';
}

@Component({
  selector: 'app-pdf-to-text',
  templateUrl: './pdf-to-text.component.html',
  styleUrls: ['./pdf-to-text.component.css']
})
export class PdfToTextComponent {
  fileList: NzUploadFile[] = [];
  extracting = false;
  extractionProgress = 0;
  extracted = false;
  extractedText: string = '';
  totalPages: number = 0;
  
  options: TextExtractionOptions = {
    extractionMode: 'all',
    startPage: 1,
    endPage: 1,
    specificPages: '',
    preserveLineBreaks: true,
    includePageNumbers: true,
    useOcr: false,
    ocrLanguage: 'eng',
    outputFormat: 'txt'
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

  get pageRangeValid(): boolean {
    if (this.options.extractionMode === 'range') {
      return this.options.startPage <= this.options.endPage && 
             this.options.startPage >= 1 && 
             this.options.endPage <= this.totalPages;
    }
    return true;
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    
    if (!isPdf) {
      return false;
    }
    
    this.fileList = [file];
    // Simulate getting page count
    this.totalPages = Math.floor(Math.random() * 50) + 5;
    this.options.endPage = this.totalPages;
    return false;
  };

  onExtract(): void {
    if (this.fileList.length === 0) return;
    
    this.extracting = true;
    this.extractionProgress = 0;
    
    // Simulate extraction progress
    const interval = setInterval(() => {
      this.extractionProgress += 10;
      if (this.extractionProgress >= 100) {
        clearInterval(interval);
        this.extracting = false;
        this.extracted = true;
        this.extractedText = this.generateSampleExtractedText();
      }
    }, 150);
  }

  private generateSampleExtractedText(): string {
    let text = '';
    const startPage = this.options.extractionMode === 'all' ? 1 : 
                      this.options.extractionMode === 'range' ? this.options.startPage : 1;
    const endPage = this.options.extractionMode === 'all' ? this.totalPages : 
                    this.options.extractionMode === 'range' ? this.options.endPage : this.totalPages;
    
    for (let page = startPage; page <= endPage; page++) {
      if (this.options.includePageNumbers) {
        text += `--- Page ${page} ---\n\n`;
      }
      
      text += `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n`;
      
      text += `Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n`;
      
      if (page < endPage && this.options.preserveLineBreaks) {
        text += '\n';
      }
    }
    
    return text.trim();
  }

  onDownload(): void {
    const blob = new Blob([this.extractedText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.fileList[0].name.replace(/\.pdf$/i, '.txt');
    link.click();
    window.URL.revokeObjectURL(url);
  }

  onCopy(): void {
    navigator.clipboard.writeText(this.extractedText).then(() => {
      alert('Text copied to clipboard!');
    });
  }

  onReset(): void {
    this.fileList = [];
    this.extracted = false;
    this.extractedText = '';
    this.extractionProgress = 0;
    this.totalPages = 0;
    this.options.startPage = 1;
    this.options.endPage = 1;
    this.options.specificPages = '';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  getSelectedPagesText(): string {
    if (this.options.extractionMode === 'all') {
      return `All ${this.totalPages} pages`;
    } else if (this.options.extractionMode === 'range') {
      return `Pages ${this.options.startPage}-${this.options.endPage}`;
    } else {
      return 'Specific pages';
    }
  }
}
