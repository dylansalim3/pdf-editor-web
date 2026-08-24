import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PageMetadata } from '../../models/studio.model';
import { StudioState } from '../../store/studio.state';
import { 
  DeleteMultiplePages, 
  DuplicatePage, 
  InsertBlankPage, 
  ReorderPages, 
  RotateAllPages, 
  RotatePage, 
  SetActivePage, 
  ToggleOrganizeModal 
} from '../../store/studio.actions';
import { StudioPdfService } from '../../services/studio-pdf.service';

@Component({
  selector: 'app-organize-modal',
  templateUrl: './organize-modal.component.html',
  styleUrls: ['./organize-modal.component.css']
})
export class OrganizeModalComponent implements OnInit {
  @Input() darkMode: boolean = false;

  @Select(StudioState.isOrganizeModalOpen) isOpen$: Observable<boolean>;
  @Select(StudioState.getPageOrder) pageOrder$: Observable<PageMetadata[]>;
  @Select(StudioState.getActivePageIndex) activePageIndex$: Observable<number>;

  selectedPages: Set<number> = new Set();
  thumbnails: Map<number, string> = new Map();

  constructor(
    private store: Store,
    private pdfService: StudioPdfService
  ) {}

  ngOnInit(): void {
    this.pageOrder$.subscribe(pages => {
      if (pages && pages.length > 0) {
        this.loadThumbnails(pages);
      }
    });
  }

  async loadThumbnails(pages: PageMetadata[]) {
    for (const page of pages) {
      if (!page.isBlank && !this.thumbnails.has(page.originalIndex)) {
        const url = await this.pdfService.renderThumbnail(page.originalIndex + 1, 0, 0.25);
        if (url) {
          this.thumbnails.set(page.originalIndex, url);
        }
      }
    }
  }

  onClose() {
    this.store.dispatch(new ToggleOrganizeModal(false));
  }

  toggleSelect(idx: number, event?: Event) {
    if (event) event.stopPropagation();
    if (this.selectedPages.has(idx)) {
      this.selectedPages.delete(idx);
    } else {
      this.selectedPages.add(idx);
    }
  }

  selectAll() {
    const pages = this.store.selectSnapshot(StudioState.getPageOrder);
    if (this.selectedPages.size === pages.length) {
      this.selectedPages.clear();
    } else {
      this.selectedPages = new Set(pages.map((_, i) => i));
    }
  }

  onRotateSelected(degrees: number) {
    if (this.selectedPages.size === 0) {
      this.store.dispatch(new RotateAllPages(degrees));
    } else {
      this.selectedPages.forEach(idx => {
        this.store.dispatch(new RotatePage(idx, degrees));
      });
    }
  }

  onDeleteSelected() {
    if (this.selectedPages.size === 0) return;
    this.store.dispatch(new DeleteMultiplePages(Array.from(this.selectedPages)));
    this.selectedPages.clear();
  }

  onDuplicateSelected() {
    if (this.selectedPages.size === 0) return;
    const sorted = Array.from(this.selectedPages).sort((a, b) => b - a);
    sorted.forEach(idx => {
      this.store.dispatch(new DuplicatePage(idx));
    });
    this.selectedPages.clear();
  }

  onAddBlankPage() {
    const pages = this.store.selectSnapshot(StudioState.getPageOrder);
    this.store.dispatch(new InsertBlankPage(pages.length));
  }

  onDrop(event: CdkDragDrop<PageMetadata[]>) {
    const currentOrder = [...this.store.selectSnapshot(StudioState.getPageOrder)];
    moveItemInArray(currentOrder, event.previousIndex, event.currentIndex);
    this.store.dispatch(new ReorderPages(currentOrder));
    this.selectedPages.clear();
  }

  onSelectAndClose(idx: number) {
    this.store.dispatch(new SetActivePage(idx));
    this.onClose();
  }
}
