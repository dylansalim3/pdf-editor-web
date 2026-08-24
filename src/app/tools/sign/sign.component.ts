import { Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { PDFDocument } from 'pdf-lib';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import * as pdfjsLib from 'pdfjs-dist';
import { StoreBlobFile } from '../../pdf-rotate/actions/pdf-rotate.actions';

try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
} catch (e) {}

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements AfterViewInit {
  @ViewChild('sigCanvas') sigCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pdfPreviewCanvas') pdfPreviewCanvas!: ElementRef<HTMLCanvasElement>;

  fileList: NzUploadFile[] = [];
  fileName = '';
  originalBuffer: ArrayBuffer | null = null;
  totalPages = 0;
  targetPage = 1;
  loading = false;
  signing = false;

  // Signature state
  signatureMode: 'draw' | 'type' | 'upload' = 'draw';
  penColor: string = '#000000';
  penWidth: number = 3;
  typedName: string = '';
  uploadedSigDataUrl: string | null = null;

  // Canvas drawing state
  private ctx: CanvasRenderingContext2D | null = null;
  private isDrawing = false;
  private hasDrawn = false;

  // Placement presets
  positionPreset: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' = 'bottom-right';
  signatureScale: number = 1.0; // multiplier

  // Output
  signedBlobUrl: string | null = null;
  signedBase64: string | null = null;

  constructor(
    private msg: NzMessageService,
    private store: Store,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.initSigCanvas();
  }

  initSigCanvas() {
    if (!this.sigCanvas) return;
    const canvas = this.sigCanvas.nativeElement;
    this.ctx = canvas.getContext('2d');
    if (this.ctx) {
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.clearCanvas();
    }
  }

  clearCanvas() {
    if (!this.ctx || !this.sigCanvas) return;
    const canvas = this.sigCanvas.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.hasDrawn = false;
  }

  startDrawing(event: MouseEvent | TouchEvent) {
    if (!this.ctx || !this.sigCanvas) return;
    this.isDrawing = true;
    this.hasDrawn = true;
    const rect = this.sigCanvas.nativeElement.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    this.ctx.beginPath();
    this.ctx.strokeStyle = this.penColor;
    this.ctx.lineWidth = this.penWidth;
    this.ctx.moveTo(clientX - rect.left, clientY - rect.top);
  }

  draw(event: MouseEvent | TouchEvent) {
    if (!this.isDrawing || !this.ctx || !this.sigCanvas) return;
    event.preventDefault();
    const rect = this.sigCanvas.nativeElement.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    this.ctx.lineTo(clientX - rect.left, clientY - rect.top);
    this.ctx.stroke();
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const raw = (file as any).originFileObj || file;
    this.loadPDF(raw as File);
    return false;
  };

  async loadPDF(file: File) {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      this.msg.warning('Please select a valid PDF file.');
      return;
    }

    this.loading = true;
    this.fileName = file.name;
    this.signedBlobUrl = null;

    try {
      this.originalBuffer = await file.arrayBuffer();
      const pdfJsDoc = await pdfjsLib.getDocument({ data: this.originalBuffer.slice(0) }).promise;
      this.totalPages = pdfJsDoc.numPages;
      this.targetPage = 1;
      this.msg.success(`Loaded document "${file.name}" (${this.totalPages} pages)`);
      setTimeout(() => this.initSigCanvas(), 100);
    } catch (err) {
      console.error(err);
      this.msg.error('Failed to load PDF.');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  onSignatureImageUpload(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.uploadedSigDataUrl = reader.result as string;
      this.msg.success('Signature image uploaded');
    };
    reader.readAsDataURL(file);
  }

  async getSignaturePngBytes(): Promise<Uint8Array | null> {
    if (this.signatureMode === 'draw') {
      if (!this.hasDrawn || !this.sigCanvas) return null;
      const dataUrl = this.sigCanvas.nativeElement.toDataURL('image/png');
      return this.dataUrlToBytes(dataUrl);
    } else if (this.signatureMode === 'type') {
      if (!this.typedName.trim()) return null;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 400;
      tempCanvas.height = 150;
      const tCtx = tempCanvas.getContext('2d');
      if (!tCtx) return null;

      tCtx.font = 'italic 44px "Brush Script MT", "Caveat", "Dancing Script", cursive, sans-serif';
      tCtx.fillStyle = this.penColor;
      tCtx.textBaseline = 'middle';
      tCtx.fillText(this.typedName, 20, 75);

      const dataUrl = tempCanvas.toDataURL('image/png');
      return this.dataUrlToBytes(dataUrl);
    } else if (this.signatureMode === 'upload') {
      if (!this.uploadedSigDataUrl) return null;
      return this.dataUrlToBytes(this.uploadedSigDataUrl);
    }
    return null;
  }

  private dataUrlToBytes(dataUrl: string): Uint8Array {
    const base64 = dataUrl.split(',')[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  async applySignature() {
    if (!this.originalBuffer) {
      this.msg.warning('Please upload a PDF document first.');
      return;
    }

    const sigBytes = await this.getSignaturePngBytes();
    if (!sigBytes) {
      this.msg.warning('Please create or provide a signature before applying.');
      return;
    }

    this.signing = true;
    try {
      const pdfDoc = await PDFDocument.load(this.originalBuffer, { ignoreEncryption: true });
      const embeddedSig = await pdfDoc.embedPng(sigBytes);

      const pagesToSign = this.targetPage === 0 
        ? pdfDoc.getPages() 
        : [pdfDoc.getPage(this.targetPage - 1)];

      const sigWidth = 160 * this.signatureScale;
      const sigHeight = 60 * this.signatureScale;

      for (const page of pagesToSign) {
        const { width, height } = page.getSize();
        let x = width - sigWidth - 40;
        let y = 40;

        if (this.positionPreset === 'bottom-left') {
          x = 40;
          y = 40;
        } else if (this.positionPreset === 'bottom-center') {
          x = (width - sigWidth) / 2;
          y = 40;
        } else if (this.positionPreset === 'top-right') {
          x = width - sigWidth - 40;
          y = height - sigHeight - 40;
        }

        page.drawImage(embeddedSig, {
          x,
          y,
          width: sigWidth,
          height: sigHeight
        });
      }

      const outBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([outBytes], { type: 'application/pdf' });
      this.signedBlobUrl = URL.createObjectURL(blob);
      this.signedBase64 = await pdfDoc.saveAsBase64({ dataUri: true });

      this.msg.success('Signature successfully embedded into PDF!');
    } catch (err) {
      console.error(err);
      this.msg.error('Failed to stamp signature onto PDF.');
    } finally {
      this.signing = false;
      this.cdr.detectChanges();
    }
  }

  download() {
    if (!this.signedBlobUrl) return;
    const a = document.createElement('a');
    a.href = this.signedBlobUrl;
    a.download = this.fileName.replace('.pdf', '_signed.pdf');
    a.click();
  }

  openInEditor() {
    if (!this.signedBase64) return;
    this.store.dispatch(new StoreBlobFile(this.signedBase64));
    this.router.navigate(['/pdf-rotate/editor']);
  }
}

