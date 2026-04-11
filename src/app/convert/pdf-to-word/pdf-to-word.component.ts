import { Component } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from 'docx';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
  convertedBlobUrl: string = '';
  
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
    { value: 'ita', label: 'Italian' }
  ];

  beforeUpload = (file: NzUploadFile): boolean => {
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    
    if (!isPdf) {
      return false;
    }
    
    this.fileList = [file];
    return false;
  };

  async onConvert(): Promise<void> {
    if (this.fileList.length === 0) return;
    
    this.converting = true;
    this.conversionProgress = 0;
    
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

      this.conversionProgress = 20;
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const total = pdf.numPages;
      let fullText = '';
      const paragraphs: Paragraph[] = [];
      
      for (let pageNum = 1; pageNum <= total; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        let lastY;
        let textForPage = '';
        for (const item of textContent.items) {
          const anyItem = item as any;
          if (lastY == anyItem.transform[5] || !lastY) {
            textForPage += anyItem.str;
          } else {
            paragraphs.push(new Paragraph({
              children: [new TextRun(textForPage)],
            }));
            fullText += textForPage + '\n';
            textForPage = anyItem.str;
          }
          lastY = anyItem.transform[5];
        }
        
        if (textForPage) {
          paragraphs.push(new Paragraph({
            children: [new TextRun(textForPage)],
          }));
          fullText += textForPage + '\n';
        }
        
        this.conversionProgress = 20 + Math.round((pageNum / total) * 50);
      }
      
      this.extractedText = fullText;

      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs,
        }],
      });

      const blob = await Packer.toBlob(doc);
      this.convertedBlobUrl = window.URL.createObjectURL(blob);
      
      this.convertedFile = {
        name: this.fileList[0].name.replace(/\.pdf$/i, `.${this.options.outputFormat}`),
        size: blob.size,
        pages: total
      };

      this.converted = true;
      this.conversionProgress = 100;
    } catch (err) {
      console.error(err);
      alert('Failed to convert PDF to Word');
    } finally {
      this.converting = false;
    }
  }

  onDownload(): void {
    if (!this.convertedBlobUrl) return;
    const link = document.createElement('a');
    link.href = this.convertedBlobUrl;
    link.download = this.convertedFile?.name || 'converted.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onReset(): void {
    this.fileList = [];
    this.converted = false;
    this.convertedFile = null;
    this.conversionProgress = 0;
    this.extractedText = '';
    this.showPreview = false;
    if (this.convertedBlobUrl) {
      window.URL.revokeObjectURL(this.convertedBlobUrl);
      this.convertedBlobUrl = '';
    }
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
      alert('Text copied to clipboard!');
    });
  }
}
