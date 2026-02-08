import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { PdfRotateState } from '../../state/pdf-rotate.state';
import { Observable, Subscription } from 'rxjs';
import { PagesLoadedEvent } from 'ngx-extended-pdf-viewer';
import { degrees, PDFDocument, PDFPage, RGB, rgb, StandardFonts } from 'pdf-lib';
import { ClearState, RedoBlobFileChanges, StoreBlobFile, UndoBlobFileChanges } from '../../actions/pdf-rotate.actions';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Router } from '@angular/router';

interface MergeFile {
  name: string;
  file: File;
  arrayBuffer: ArrayBuffer;
}

@Component({
  selector: 'app-pdf-rotate-editor',
  templateUrl: './pdf-rotate-editor.component.html',
  styleUrls: ['./pdf-rotate-editor.component.css']
})
export class PdfRotateEditorComponent implements OnInit, OnDestroy {
  src: any;
  col = 8;
  id = -1;
  startPage = 1;
  endPage = 2;
  maxPage = 0;
  currentPage = 1;
  isCustomRotatePage = false;
  predefinedStyleSelectionIndex = 0;
  loading = false;

  removeStartPage = 1;
  removeEndPage = 1;
  isDeleteOnePage = false;

  watermarkText = '';
  colorCode = '#eeeeee';

  pdfDocs: PDFDocument;
  pdfPages: PDFPage[];

  mergeFileList: NzUploadFile[] = [];
  mergeFiles: MergeFile[] = [];

  blobFileSubscription: Subscription;

  @Select(PdfRotateState.getBlobFile) blobFile$: Observable<any>;

  constructor(private store: Store, private modalService: NzModalService, private router: Router) {}

  ngOnInit(): void {
    this.blobFileSubscription = this.blobFile$.subscribe((file) => {
      this.loading = false;
      this.src = file;

      PDFDocument.load(file, { ignoreEncryption: true })
        .then((pdfDocs) => {
          this.pdfDocs = pdfDocs;
          console.log(pdfDocs);
          this.pdfPages = pdfDocs.getPages();
          console.log(pdfDocs.getPages());
          if (pdfDocs.isEncrypted) {
            this.showConfirmModal('The file is encrypted. Please choose a file that is not encrypted.');
            this.router.navigateByUrl('/pdf-rotate');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  onPageLoaded({ pagesCount }: PagesLoadedEvent): void {
    this.maxPage = pagesCount;
  }

  onCurrentPageChanged(pageNum: number): void {
    if (!this.isCustomRotatePage) {
      this.currentPage = pageNum;
    }
  }

  onRotateLeft(): void {
    const rotationDegree = -90;
    this.rotatePDF(rotationDegree);
  }

  onRotateRight(): void {
    const rotationDegree = 90;
    this.rotatePDF(rotationDegree);
  }

  private rotatePDF(rotationDegree: number): void {
    const currentPDFPage = this.pdfPages[this.currentPage - 1];
    this.loading = true;
    const currentRotation = currentPDFPage.getRotation().angle;
    currentPDFPage.setRotation(degrees(currentRotation + rotationDegree));
    this.refreshPDF();
  }

  private refreshPDF(): void {
    this.pdfDocs.saveAsBase64({ dataUri: true }).then((pdfUint8Array) => {
      this.store.dispatch(new StoreBlobFile(pdfUint8Array));
    });
  }

  async onMovePages(): Promise<void> {
    const [copiedPage] = await this.pdfDocs.copyPages(this.pdfDocs, [this.startPage - 1]);
    this.loading = true;
    this.pdfDocs.removePage(this.startPage - 1);
    this.pdfDocs.insertPage(this.endPage - 1, copiedPage);
    this.refreshPDF();
  }

  async onAddWatermark(text: string, colorCode: string, predefinedStyleSelectionIndex: number): Promise<void> {
    if (text.length <= 0) {
      this.showConfirmModal('Watermark text is empty');
    } else {
      const rgbValue = this.convertHexColorCodeToRGB(colorCode);
      const { width, height } = this.pdfPages[0].getSize();
      const watermarkStyle = await this.getPredefinedWatermarkStyle(
        predefinedStyleSelectionIndex,
        text.length,
        width,
        height,
        rgbValue
      );
      this.pdfPages.forEach((pdfPage) => {
        pdfPage.drawText(text, watermarkStyle);
      });
      this.refreshPDF();
    }
  }

  onRemovePage(startPage: number, endPage: number): void {
    const pagesToKeep: number[] = [];
    if (this.isDeleteOnePage) {
      pagesToKeep.push(startPage - 1);
    } else {
      for (let i = startPage; i <= endPage; i++) {
        pagesToKeep.push(i - 1);
      }
    }
    for (let i = this.pdfDocs.getPageCount() - 1; i >= 0; i--) {
      if (!pagesToKeep.includes(i)) {
        console.log(i);
        this.pdfDocs.removePage(i);
      }
    }
    this.refreshPDF();
  }

  onUndoChanges(): void {
    this.store.dispatch(new UndoBlobFileChanges());
  }

  onRedoChanges(): void {
    this.store.dispatch(new RedoBlobFileChanges());
  }

  onSavePDF(): void {
    const linkSource = this.src;
    const downloadLink = document.createElement('a');
    const fileName = 'pdf-editor.pdf';

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  onBeforeUploadMerge = (file: NzUploadFile): boolean => {
    const pdfFile = file as any;
    if (pdfFile.originFileObj) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        this.mergeFiles.push({
          name: pdfFile.name,
          file: pdfFile.originFileObj,
          arrayBuffer
        });
        this.mergeFiles = [...this.mergeFiles];
      };
      reader.readAsArrayBuffer(pdfFile.originFileObj);
    }
    return false;
  }

  removeMergeFile(index: number): void {
    this.mergeFiles.splice(index, 1);
    this.mergeFiles = [...this.mergeFiles];
  }

  async onMergePDFs(): Promise<void> {
    if (this.mergeFiles.length === 0) {
      this.showConfirmModal('Please add at least one PDF file to merge.');
      return;
    }

    this.loading = true;

    try {
      const mergedPdf = await PDFDocument.create();

      const currentPages = await mergedPdf.copyPages(this.pdfDocs, this.pdfDocs.getPageIndices());
      currentPages.forEach((page) => mergedPdf.addPage(page));

      for (const mergeFile of this.mergeFiles) {
        const pdfToMerge = await PDFDocument.load(mergeFile.arrayBuffer, { ignoreEncryption: true });
        const pagesToMerge = await mergedPdf.copyPages(pdfToMerge, pdfToMerge.getPageIndices());
        pagesToMerge.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBase64 = await mergedPdf.saveAsBase64({ dataUri: true });
      this.store.dispatch(new StoreBlobFile(mergedPdfBase64));

      this.mergeFiles = [];
      this.mergeFileList = [];

      this.showConfirmModal('PDFs merged successfully!');
    } catch (error) {
      console.error('Error merging PDFs:', error);
      this.showConfirmModal('Error merging PDFs. Please ensure all files are valid PDFs.');
    } finally {
      this.loading = false;
    }
  }

  private async getPredefinedWatermarkStyle(
    index: number,
    textLength: number,
    pageWidth: number,
    pageHeight: number,
    colorRGB: RGB
  ) {
    let rotate = degrees(0);
    const x = pageWidth / 2 - textLength * 7;
    let y = pageHeight / 2 - textLength * 7;
    const helveticaFont = await this.pdfDocs.embedFont(StandardFonts.Helvetica);
    switch (index) {
      case 1:
        rotate = degrees(45);
        break;
      case 2:
        rotate = degrees(-45);
        break;
      case 3:
        rotate = degrees(0);
        y = pageHeight / 2;
        break;
    }
    return {
      x,
      y,
      size: 50,
      font: helveticaFont,
      color: colorRGB,
      rotate
    };
  }

  private convertHexColorCodeToRGB(hexColor: string): RGB {
    const matches = hexColor.match(/[A-Za-z0-9]{2}/g) || [];
    const [x, y, z] = matches.map((value) => parseInt(value, 16) / 255);
    return rgb(x, y, z);
  }

  private showConfirmModal(text: string): void {
    this.modalService.confirm({
      nzTitle: 'Information',
      nzContent: text,
      nzOkText: 'OK',
      nzCancelText: null,
      nzIconType: 'info-circle'
    });
  }

  ngOnDestroy(): void {
    if (this.blobFileSubscription) {
      this.blobFileSubscription.unsubscribe();
    }
    this.store.dispatch(new ClearState());
  }
}
