import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PageMetadata } from '../../models/studio.model';
import { StudioState } from '../../store/studio.state';
import { 
  DeletePage, 
  DuplicatePage, 
  InsertBlankPage, 
  ReorderPages, 
  RotatePage, 
  SetActivePage, 
  ToggleOrganizeModal 
} from '../../store/studio.actions';
import { StudioPdfService } from '../../services/studio-pdf.service';

@Component({
  selector: 'app-page-thumbnails',
  templateUrl: './page-thumbnails.component.html',
  styleUrls: ['./page-thumbnails.component.css']
})
export class PageThumbnailsComponent implements OnInit, OnChanges {
  @Input() darkMode: boolean = false;

  @Select(StudioState.getPageOrder) pageOrder$: Observable<PageMetadata[]>;
  @Select(StudioState.getActivePageIndex) activePageIndex$: Observable<number>;

  collapsed: boolean = false;
  thumbnails: Map<number, string> = new Map();
  loadingThumbnails: boolean = false;

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

  ngOnChanges(changes: SimpleChanges): void {}

  async loadThumbnails(pages: PageMetadata[]) {
    for (const page of pages) {
      if (!page.isBlank && !this.thumbnails.has(page.originalIndex)) {
        const url = await this.pdfService.renderThumbnail(page.originalIndex + 1, 0, 0.2);
        if (url) {
          this.thumbnails.set(page.originalIndex, url);
        }
      }
    }
  }

  onSelectPage(index: number) {
    this.store.dispatch(new SetActivePage(index));
  }

  onRotateLeft(index: number, event: Event) {
    event.stopPropagation();
    this.store.dispatch(new RotatePage(index, -90));
  }

  onRotateRight(index: number, event: Event) {
    event.stopPropagation();
    this.store.dispatch(new RotatePage(index, 90));
  }

  onDuplicate(index: number, event: Event) {
    event.stopPropagation();
    this.store.dispatch(new DuplicatePage(index));
  }

  onDelete(index: number, event: Event) {
    event.stopPropagation();
    this.store.dispatch(new DeletePage(index));
  }

  onDrop(event: CdkDragDrop<PageMetadata[]>) {
    const currentOrder = [...this.store.selectSnapshot(StudioState.getPageOrder)];
    moveItemInArray(currentOrder, event.previousIndex, event.currentIndex);
    this.store.dispatch(new ReorderPages(currentOrder));
    this.store.dispatch(new SetActivePage(event.currentIndex));
  }

  onAddBlankPage() {
    const activeIndex = this.store.selectSnapshot(StudioState.getActivePageIndex);
    this.store.dispatch(new InsertBlankPage(activeIndex + 1));
  }

  onOpenOrganize() {
    this.store.dispatch(new ToggleOrganizeModal(true));
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }
}
