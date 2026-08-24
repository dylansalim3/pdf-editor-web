import { Injectable } from '@angular/core';
import { degrees, PDFDocument, rgb, StandardFonts, PDFPage } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { AnnotationItem, PageMetadata, StudioStateModel } from '../models/studio.model';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

@Injectable({
  providedIn: 'root'
})
export class StudioPdfService {
  private pdfDocCache: any = null;
  private currentBufferCache: ArrayBuffer | null = null;

  constructor() {}

  /**
   * Parse hex color '#4f46e5' to pdf-lib rgb(r, g, b)
   */
  private hexToRgb(hex: string) {
    if (!hex) return rgb(0, 0, 0);
    const cleanHex = hex.replace('#', '');
    const num = parseInt(cleanHex, 16);
    if (cleanHex.length === 3) {
      const r = ((num >> 8) & 0xf) * 17;
      const g = ((num >> 4) & 0xf) * 17;
      const b = (num & 0xf) * 17;
      return rgb(r / 255, g / 255, b / 255);
    }
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return rgb(r / 255, g / 255, b / 255);
  }

  /**
   * Loads a document from File, ArrayBuffer, or Base64 string
   */
  async loadDocument(input: File | ArrayBuffer | string): Promise<{
    rawBuffer: ArrayBuffer;
    base64: string;
    pageCount: number;
    fileName: string;
    fileSize: number;
  }> {
    let rawBuffer: ArrayBuffer;
    let fileName = 'document.pdf';
    let fileSize = 0;

    if (input instanceof File) {
      fileName = input.name;
      fileSize = input.size;
      rawBuffer = await input.arrayBuffer();
    } else if (input instanceof ArrayBuffer) {
      rawBuffer = input;
      fileSize = input.byteLength;
    } else if (typeof input === 'string') {
      const base64Clean = input.replace(/^data:application\/pdf;base64,/, '');
      const binaryString = window.atob(base64Clean);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      rawBuffer = bytes.buffer;
      fileSize = rawBuffer.byteLength;
    } else {
      throw new Error('Unsupported input format');
    }

    const pdfDoc = await PDFDocument.load(rawBuffer, { ignoreEncryption: true });
    const pageCount = pdfDoc.getPageCount();

    // Cache PDF.js instance
    this.currentBufferCache = rawBuffer;
    this.pdfDocCache = await pdfjsLib.getDocument({ data: rawBuffer.slice(0) }).promise;

    const base64 = await pdfDoc.saveAsBase64({ dataUri: true });

    return {
      rawBuffer,
      base64,
      pageCount,
      fileName,
      fileSize
    };
  }

  /**
   * Render a specific page as a dataURL thumbnail image
   */
  async renderThumbnail(pageNumber: number, rotation: number = 0, scale: number = 0.25): Promise<string> {
    if (!this.pdfDocCache) return '';

    try {
      const page = await this.pdfDocCache.getPage(pageNumber);
      const viewport = page.getViewport({ scale, rotation });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return '';

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport
      }).promise;

      return canvas.toDataURL('image/jpeg', 0.8);
    } catch (err) {
      console.error('Failed to render thumbnail for page', pageNumber, err);
      return '';
    }
  }

  /**
   * Render a page directly onto an HTML5 canvas
   */
  async renderPageToCanvas(
    pageNumber: number,
    rotation: number,
    scale: number,
    canvas: HTMLCanvasElement
  ): Promise<{ width: number; height: number }> {
    if (!this.pdfDocCache) {
      throw new Error('No PDF document loaded in cache');
    }

    const page = await this.pdfDocCache.getPage(pageNumber);
    const viewport = page.getViewport({ scale, rotation });

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Cannot get 2d context');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport
    }).promise;

    return {
      width: viewport.width,
      height: viewport.height
    };
  }

  /**
   * Bakes all page reorders, rotations, deletions, vector markups, text, signatures, and watermarks
   * directly into a native PDF binary using PDF-lib.
   */
  async bakeDocument(state: StudioStateModel, options: { compress?: boolean } = {}): Promise<Uint8Array> {
    if (!state.rawBuffer) {
      throw new Error('No raw document buffer found in state');
    }

    const sourceDoc = await PDFDocument.load(state.rawBuffer, { ignoreEncryption: true });
    const outputDoc = await PDFDocument.create();

    // Standard fonts for text embedding
    const helveticaFont = await outputDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await outputDoc.embedFont(StandardFonts.HelveticaBold);
    const timesRomanFont = await outputDoc.embedFont(StandardFonts.TimesRoman);
    const courierFont = await outputDoc.embedFont(StandardFonts.Courier);

    const getFont = (family?: string) => {
      if (!family) return helveticaFont;
      const lower = family.toLowerCase();
      if (lower.includes('bold')) return helveticaBoldFont;
      if (lower.includes('times')) return timesRomanFont;
      if (lower.includes('courier')) return courierFont;
      return helveticaFont;
    };

    // Cache embedded images (e.g. signature PNGs) to avoid duplicate embedding
    const embeddedImages = new Map<string, any>();

    // Process each page in pageOrder
    for (let newIndex = 0; newIndex < state.pageOrder.length; newIndex++) {
      const meta = state.pageOrder[newIndex];
      let targetPage: PDFPage;

      if (meta.isBlank) {
        // Standard US Letter dimensions (612 x 792 pt)
        targetPage = outputDoc.addPage([612, 792]);
      } else {
        const [copiedPage] = await outputDoc.copyPages(sourceDoc, [meta.originalIndex]);
        targetPage = outputDoc.addPage(copiedPage);
      }

      // Apply rotation
      const existingRotation = targetPage.getRotation().angle;
      const finalRotation = (existingRotation + meta.rotation + 360) % 360;
      targetPage.setRotation(degrees(finalRotation));

      const { width: pageWidth, height: pageHeight } = targetPage.getSize();

      // Find annotations belonging to this active page position
      const pageAnnotations = state.annotations.filter(a => a.pageIndex === newIndex);

      for (const ann of pageAnnotations) {
        await this.renderAnnotationOnPdfPage(
          outputDoc,
          targetPage,
          ann,
          pageWidth,
          pageHeight,
          getFont,
          embeddedImages
        );
      }
    }

    // Save with compression if requested
    return await outputDoc.save({
      useObjectStreams: !!options.compress
    });
  }

  /**
   * Helper to draw a single vector annotation onto a pdf-lib PDFPage
   */
  private async renderAnnotationOnPdfPage(
    pdfDoc: PDFDocument,
    page: PDFPage,
    ann: AnnotationItem,
    pageWidth: number,
    pageHeight: number,
    getFont: (family?: string) => any,
    embeddedImages: Map<string, any>
  ): Promise<void> {
    const pdfX = (ann.x / 100) * pageWidth;
    const pdfY = pageHeight - ((ann.y / 100) * pageHeight) - ((ann.height / 100) * pageHeight);
    const pdfW = (ann.width / 100) * pageWidth;
    const pdfH = (ann.height / 100) * pageHeight;
    const color = this.hexToRgb(ann.color);
    const opacity = ann.opacity ?? 1;

    switch (ann.type) {
      case 'text': {
        if (!ann.text) break;
        const font = getFont(ann.fontFamily);
        const fontSize = ann.fontSize ? (ann.fontSize / 100) * 16 : 14;
        page.drawText(ann.text, {
          x: pdfX,
          y: pdfY + pdfH - fontSize,
          size: fontSize,
          font,
          color,
          opacity
        });
        break;
      }

      case 'watermark': {
        const text = ann.text || 'CONFIDENTIAL';
        const font = getFont('bold');
        const fontSize = ann.fontSize ? (ann.fontSize / 100) * 48 : 36;
        const angle = ann.rotation ?? 45;
        page.drawText(text, {
          x: pdfX + pdfW / 2 - (text.length * fontSize) / 4,
          y: pdfY + pdfH / 2,
          size: fontSize,
          font,
          color,
          opacity: ann.opacity ?? 0.2,
          rotate: degrees(angle)
        });
        break;
      }

      case 'rectangle': {
        page.drawRectangle({
          x: pdfX,
          y: pdfY,
          width: pdfW,
          height: pdfH,
          borderColor: color,
          borderWidth: ann.strokeWidth ?? 2,
          opacity
        });
        break;
      }

      case 'circle': {
        page.drawEllipse({
          x: pdfX + pdfW / 2,
          y: pdfY + pdfH / 2,
          xScale: pdfW / 2,
          yScale: pdfH / 2,
          borderColor: color,
          borderWidth: ann.strokeWidth ?? 2,
          opacity
        });
        break;
      }

      case 'redact': {
        // Solid black redact rectangle
        page.drawRectangle({
          x: pdfX,
          y: pdfY,
          width: pdfW,
          height: pdfH,
          color: rgb(0, 0, 0),
          opacity: 1
        });
        break;
      }

      case 'signature': {
        if (!ann.dataUrl) break;
        try {
          let embeddedImg = embeddedImages.get(ann.dataUrl);
          if (!embeddedImg) {
            const isPng = ann.dataUrl.includes('image/png');
            const cleanBase64 = ann.dataUrl.replace(/^data:image\/[a-z]+;base64,/, '');
            const binary = window.atob(cleanBase64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
              bytes[i] = binary.charCodeAt(i);
            }
            embeddedImg = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
            embeddedImages.set(ann.dataUrl, embeddedImg);
          }

          page.drawImage(embeddedImg, {
            x: pdfX,
            y: pdfY,
            width: pdfW,
            height: pdfH,
            opacity
          });
        } catch (err) {
          console.error('Failed to embed signature image', err);
        }
        break;
      }

      case 'highlight': {
        page.drawRectangle({
          x: pdfX,
          y: pdfY,
          width: pdfW,
          height: pdfH,
          color: rgb(1, 0.95, 0.2), // Highlighter Yellow
          opacity: ann.opacity ?? 0.35
        });
        break;
      }

      default:
        break;
    }
  }
}
