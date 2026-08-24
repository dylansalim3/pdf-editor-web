import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { StudioState } from '../../store/studio.state';
import { 
  RedoStudioAction, 
  SetZoomLevel, 
  ToggleCommandPalette, 
  ToggleExportModal, 
  ToggleOrganizeModal, 
  UndoStudioAction 
} from '../../store/studio.actions';

@Component({
  selector: 'app-studio-header',
  templateUrl: './studio-header.component.html',
  styleUrls: ['./studio-header.component.css']
})
export class StudioHeaderComponent {
  @Input() darkMode: boolean = false;
  @Output() toggleDark = new EventEmitter<void>();

  @Select(StudioState.getFileName) fileName$: Observable<string>;
  @Select(StudioState.getZoomLevel) zoomLevel$: Observable<number>;
  @Select(StudioState.canUndo) canUndo$: Observable<boolean>;
  @Select(StudioState.canRedo) canRedo$: Observable<boolean>;
  @Select(StudioState.getPageOrder) pageOrder$: Observable<any[]>;
  @Select(StudioState.getActivePageIndex) activePageIndex$: Observable<number>;

  constructor(private store: Store) {}

  onUndo() {
    this.store.dispatch(new UndoStudioAction());
  }

  onRedo() {
    this.store.dispatch(new RedoStudioAction());
  }

  onZoomIn() {
    const current = this.store.selectSnapshot(StudioState.getZoomLevel);
    this.store.dispatch(new SetZoomLevel(Math.min(current + 15, 300)));
  }

  onZoomOut() {
    const current = this.store.selectSnapshot(StudioState.getZoomLevel);
    this.store.dispatch(new SetZoomLevel(Math.max(current - 15, 30)));
  }

  onResetZoom() {
    this.store.dispatch(new SetZoomLevel(100));
  }

  onOpenOrganize() {
    this.store.dispatch(new ToggleOrganizeModal(true));
  }

  onOpenExport() {
    this.store.dispatch(new ToggleExportModal(true));
  }

  onOpenCommandPalette() {
    this.store.dispatch(new ToggleCommandPalette(true));
  }
}
