import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { PdfRotateState } from '../../pdf-rotate/state/pdf-rotate.state';
import { Observable, Subscription } from 'rxjs';
import { PagesLoadedEvent } from 'ngx-extended-pdf-viewer';
import { PDFDocument } from 'pdf-lib';
import { StoreBlobFile, UndoBlobFileChanges, RedoBlobFileChanges } from '../../pdf-rotate/actions/pdf-rotate.actions';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit, OnDestroy {
  @Select(PdfRotateState.getBlobFile) blobFile$: Observable<any>;

  src: any;
  pdfDocs: PDFDocument;
  maxPage = 0;
  currentPage = 1;
  loading = false;

  deleteMode: 'single' | 'range' | 'multiple' = 'single';
  singlePage = 1;
  rangeStart = 1;
  rangeEnd = 1;
  selectedPages: number[] = [];
  pagesToDelete: number[] = [];

  private blobFileSubscription: Subscription;

  constructor(
    private store: Store,
    private modal: NzModalService
  ) {}

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
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  }

  onPageLoaded(event: PagesLoadedEvent): void {
    this.maxPage = event.pagesCount;
    this.rangeEnd = this.maxPage;
  }

  onCurrentPageChanged(pageNum: number): void {
    this.currentPage = pageNum;
  }

  togglePageSelection(pageNum: number): void {
    const index = this.selectedPages.indexOf(pageNum);
    if (index > -1) {
      this.selectedPages.splice(index, 1);
    } else {
      this.selectedPages.push(pageNum);
      this.selectedPages.sort((a, b) => a - b);
    }
  }

  isPageSelected(pageNum: number): boolean {
    return this.selectedPages.includes(pageNum);
  }

  isPageMarkedForDeletion(pageNum: number): boolean {
    return this.pagesToDelete.includes(pageNum);
  }

  previewDeletion(): void {
    this.pagesToDelete = [];

    if (this.deleteMode === 'single') {
      this.pagesToDelete = [this.singlePage];
    } else if (this.deleteMode === 'range') {
      for (let i = this.rangeStart; i <= this.rangeEnd; i++) {
        this.pagesToDelete.push(i);
      }
    } else if (this.deleteMode === 'multiple') {
      this.pagesToDelete = [...this.selectedPages];
    }
  }

  onDelete(): void {
    this.previewDeletion();

    if (this.pagesToDelete.length === 0) {
      this.modal.warning({
        nzTitle: 'No Pages Selected',
        nzContent: 'Please select at least one page to delete.'
      });
      return;
    }

    this.modal.confirm({
      nzTitle: 'Confirm Deletion',
      nzContent: `Are you sure you want to delete ${this.pagesToDelete.length} page(s)? This action cannot be undone.`,
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOnOk: () => this.executeDelete()
    });
  }

  private async executeDelete(): Promise<void> {
    if (!this.pdfDocs || this.pagesToDelete.length === 0) {
      return;
    }

    this.loading = true;

    setTimeout(async () => {
      try {
        // Sort in descending order to delete from end to beginning
        const sortedPages = [...this.pagesToDelete].sort((a, b) => b - a);

        for (const pageNum of sortedPages) {
          if (pageNum >= 1 && pageNum <= this.pdfDocs.getPageCount()) {
            this.pdfDocs.removePage(pageNum - 1);
          }
        }

        await this.refreshPdf();

        // Reset selections
        this.selectedPages = [];
        this.pagesToDelete = [];

        // Update max page
        this.maxPage = this.pdfDocs.getPageCount();
        this.singlePage = Math.min(this.singlePage, this.maxPage);
        this.rangeStart = Math.min(this.rangeStart, this.maxPage);
        this.rangeEnd = Math.min(this.rangeEnd, this.maxPage);

        this.modal.success({
          nzTitle: 'Pages Deleted',
          nzContent: `Successfully deleted ${sortedPages.length} page(s).`
        });
      } catch (error) {
        console.error('Error deleting pages:', error);
        this.modal.error({
          nzTitle: 'Error',
          nzContent: 'An error occurred while deleting pages.'
        });
      } finally {
        this.loading = false;
      }
    }, 100);
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
    link.download = 'modified-document.pdf';
    link.click();
  }

  keepOnlySelected(): void {
    if (this.selectedPages.length === 0) {
      this.modal.warning({
        nzTitle: 'No Pages Selected',
        nzContent: 'Please select pages to keep.'
      });
      return;
    }

    const pagesToDelete: number[] = [];
    for (let i = 1; i <= this.maxPage; i++) {
      if (!this.selectedPages.includes(i)) {
        pagesToDelete.push(i);
      }
    }

    this.modal.confirm({
      nzTitle: 'Keep Only Selected Pages',
      nzContent: `This will delete ${pagesToDelete.length} pages and keep ${this.selectedPages.length} selected pages. Continue?`,
      nzOkText: 'Keep Selected',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.pagesToDelete = pagesToDelete;
        this.executeDelete();
      }
    });
  }
}
