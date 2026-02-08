import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { PdfRotateState } from '../../pdf-rotate/state/pdf-rotate.state';
import { Observable, Subscription } from 'rxjs';
import { PagesLoadedEvent } from 'ngx-extended-pdf-viewer';
import { degrees, PDFDocument, PDFPage } from 'pdf-lib';
import { ClearState, StoreBlobFile, UndoBlobFileChanges, RedoBlobFileChanges } from '../../pdf-rotate/actions/pdf-rotate.actions';

interface PageRotation {
  pageNumber: number;
  rotation: number;
}

@Component({
  selector: 'app-rotate',
  templateUrl: './rotate.component.html',
  styleUrls: ['./rotate.component.css']
})
export class RotateComponent implements OnInit, OnDestroy {
  @Select(PdfRotateState.getBlobFile) blobFile$: Observable<any>;

  src: any;
  pdfDocs: PDFDocument;
  pdfPages: PDFPage[];
  maxPage = 0;
  currentPage = 1;
  loading = false;

  // Rotation settings
  rotationMode: 'current' | 'custom' | 'all' = 'current';
  customPage = 1;
  rotationAngle: 90 | 180 | 270 = 90;
  direction: 'clockwise' | 'counterclockwise' = 'clockwise';

  // Batch rotation
  selectedPages: number[] = [];
  pageRotations: PageRotation[] = [];

  // Page thumbnails
  showThumbnails = true;

  private blobFileSubscription: Subscription;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.blobFileSubscription = this.blobFile$.subscribe(file => {
      if (file) {
        this.loading = false;
        this.src = file;
        this.loadPdf(file);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.blobFileSubscription) {
      this.blobFileSubscription.unsubscribe();
    }
  }

  private async loadPdf(file: any): Promise<void> {
    try {
      this.pdfDocs = await PDFDocument.load(file, { ignoreEncryption: true });
      this.pdfPages = this.pdfDocs.getPages();
      this.pageRotations = this.pdfPages.map((_, index) => ({
        pageNumber: index + 1,
        rotation: 0
      }));
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  }

  onPageLoaded(event: PagesLoadedEvent): void {
    this.maxPage = event.pagesCount;
  }

  onCurrentPageChanged(pageNum: number): void {
    this.currentPage = pageNum;
    if (this.rotationMode === 'current') {
      this.customPage = pageNum;
    }
  }

  getEffectiveRotation(): number {
    let angle: number = this.rotationAngle;
    if (this.direction === 'counterclockwise') {
      angle = -angle;
    }
    return angle;
  }

  onRotate(): void {
    if (!this.pdfDocs) {
      return;
    }

    this.loading = true;
    const angle = this.getEffectiveRotation();

    setTimeout(async () => {
      try {
        if (this.rotationMode === 'current') {
          // Rotate current page
          const page = this.pdfPages[this.currentPage - 1];
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + angle));
          this.pageRotations[this.currentPage - 1].rotation += angle;
        } else if (this.rotationMode === 'custom') {
          // Rotate specific page
          if (this.customPage >= 1 && this.customPage <= this.maxPage) {
            const page = this.pdfPages[this.customPage - 1];
            const currentRotation = page.getRotation().angle;
            page.setRotation(degrees(currentRotation + angle));
            this.pageRotations[this.customPage - 1].rotation += angle;
          }
        } else if (this.rotationMode === 'all') {
          // Rotate all pages
          this.pdfPages.forEach((page, index) => {
            const currentRotation = page.getRotation().angle;
            page.setRotation(degrees(currentRotation + angle));
            this.pageRotations[index].rotation += angle;
          });
        }

        await this.refreshPdf();
      } catch (error) {
        console.error('Error rotating PDF:', error);
      } finally {
        this.loading = false;
      }
    }, 100);
  }

  onRotateLeft(): void {
    this.direction = 'counterclockwise';
    this.rotationAngle = 90;
    this.onRotate();
  }

  onRotateRight(): void {
    this.direction = 'clockwise';
    this.rotationAngle = 90;
    this.onRotate();
  }

  onRotate180(): void {
    this.rotationAngle = 180;
    this.onRotate();
  }

  private async refreshPdf(): Promise<void> {
    const pdfBase64 = await this.pdfDocs.saveAsBase64({ dataUri: true });
    this.store.dispatch(new StoreBlobFile(pdfBase64));
    this.src = pdfBase64;
  }

  onUndo(): void {
    this.store.dispatch(new UndoBlobFileChanges());
  }

  onRedo(): void {
    this.store.dispatch(new RedoBlobFileChanges());
  }

  onDownload(): void {
    const link = document.createElement('a');
    link.href = this.src;
    link.download = 'rotated-document.pdf';
    link.click();
  }

  getThumbnailStyle(pageNum: number): any {
    const rotation = this.pageRotations[pageNum - 1]?.rotation || 0;
    return {
      transform: `rotate(${rotation}deg)`,
      transition: 'transform 0.3s ease'
    };
  }

  isPageSelected(pageNum: number): boolean {
    return this.selectedPages.includes(pageNum);
  }

  togglePageSelection(pageNum: number): void {
    const index = this.selectedPages.indexOf(pageNum);
    if (index > -1) {
      this.selectedPages.splice(index, 1);
    } else {
      this.selectedPages.push(pageNum);
    }
  }

  onRotateSelected(): void {
    if (this.selectedPages.length === 0) {
      return;
    }

    this.loading = true;
    const angle = this.getEffectiveRotation();

    setTimeout(async () => {
      try {
        this.selectedPages.forEach(pageNum => {
          if (pageNum >= 1 && pageNum <= this.maxPage) {
            const page = this.pdfPages[pageNum - 1];
            const currentRotation = page.getRotation().angle;
            page.setRotation(degrees(currentRotation + angle));
            this.pageRotations[pageNum - 1].rotation += angle;
          }
        });
        await this.refreshPdf();
        this.selectedPages = [];
      } catch (error) {
        console.error('Error rotating selected pages:', error);
      } finally {
        this.loading = false;
      }
    }, 100);
  }
}
