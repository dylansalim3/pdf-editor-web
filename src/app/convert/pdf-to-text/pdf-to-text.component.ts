import { Component } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
    { value: 'ita', label: 'Italian' }
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
    
    const originFile = (file as any).originFileObj || file;
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      try {
        const arrayBuffer = e.target.result;
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        this.totalPages = pdf.numPages;
        this.options.endPage = this.totalPages;
      } catch (err) {
        console.error('Error loading PDF:', err);
      }
    };
    reader.readAsArrayBuffer(originFile as Blob);
    
    return false;
  };

  async onExtract(): Promise<void> {
    if (this.fileList.length === 0) return;
    
    this.extracting = true;
    this.extractionProgress = 0;
    this.extractedText = '';
    
    try {
      const file = this.fileList[0] as any;
      const originFile = file.originFileObj || file;
      
      let arrayBuffer: ArrayBuffer;
      if (originFile.arrayBuffer) {
        arrayBuffer = await originFile.arrayBuffer();
      } else {
        arrayBuffer = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = e => resolve(e.target?.result as ArrayBuffer);
          reader.onerror = e => reject(e);
          reader.readAsArrayBuffer(originFile);
        });
      }

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const total = pdf.numPages;
      let text = '';
      
      const startPage = this.options.extractionMode === 'all' ? 1 : 
                        this.options.extractionMode === 'range' ? this.options.startPage : 1;
      const endPage = this.options.extractionMode === 'all' ? total : 
                      this.options.extractionMode === 'range' ? this.options.endPage : total;
                      
      for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
        if (this.options.includePageNumbers) {
          text += `\n--- Page ${pageNum} ---\n\n`;
        }
        
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        let lastY;
        let textForPage = '';
        for (let item of textContent.items) {
            const anyItem = item as any;
            if (lastY == anyItem.transform[5] || !lastY){
                textForPage += anyItem.str;
            } else {
                textForPage += '\n' + anyItem.str;
            }
            lastY = anyItem.transform[5];
        }
        
        text += textForPage + '\n';
        this.extractionProgress = Math.round(((pageNum - startPage + 1) / (endPage - startPage + 1)) * 100);
      }
      
      this.extractedText = text.trim();
      this.extracted = true;
    } catch(err) {
      console.error(err);
      alert('Failed to extract text');
    } finally {
      this.extracting = false;
      this.extractionProgress = 100;
    }
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
