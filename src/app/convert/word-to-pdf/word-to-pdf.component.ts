import { Component } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import * as mammoth from 'mammoth';
import { jsPDF } from 'jspdf';

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
  convertedPdfBlob: Blob | null = null;
  convertedBlobUrl: string = '';
  
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
      this.conversionProgress = 30;

      // Extract raw text using mammoth
      // (Advanced layout is not fully supported client-side without massive HTML-to-PDF engines)
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;
      this.conversionProgress = 60;

      const pdf = new jsPDF({
        orientation: this.options.orientation,
        unit: 'mm',
        format: this.options.pageSize.toLowerCase()
      });

      // Simple rendering: Page height ~297mm for A4
      const pgHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const lines = pdf.splitTextToSize(text, pdf.internal.pageSize.getWidth() - margin * 2);
      
      let cursorY = margin;
      let pageCount = 1;

      for (let i = 0; i < lines.length; i++) {
        if (cursorY > pgHeight - margin) {
          pdf.addPage();
          cursorY = margin;
          pageCount++;
        }
        pdf.text(lines[i], margin, cursorY);
        cursorY += 6; // Standard line height
      }
      
      this.conversionProgress = 90;

      this.convertedPdfBlob = pdf.output('blob');
      this.convertedBlobUrl = window.URL.createObjectURL(this.convertedPdfBlob);

      this.convertedFile = {
        name: this.fileList[0].name.replace(/\.docx?$/, '.pdf'),
        size: this.convertedPdfBlob.size,
        pages: pageCount
      };

      this.converted = true;
    } catch (err) {
      console.error('Conversion Failed', err);
      alert('Error converting Word document - ensure it is a valid DOCX file.');
    } finally {
      this.converting = false;
      this.conversionProgress = 100;
    }
  }

  onDownload(): void {
    if (!this.convertedBlobUrl) return;
    const link = document.createElement('a');
    link.href = this.convertedBlobUrl;
    link.download = this.convertedFile?.name || 'converted.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onReset(): void {
    this.fileList = [];
    this.converted = false;
    this.convertedFile = null;
    this.conversionProgress = 0;
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
}
