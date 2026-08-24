import { Component, Input } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { StudioStateModel } from '../../models/studio.model';
import { StudioState } from '../../store/studio.state';
import { SetStudioLoading, ToggleExportModal } from '../../store/studio.actions';
import { StudioPdfService } from '../../services/studio-pdf.service';

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.css']
})
export class ExportModalComponent {
  @Input() darkMode: boolean = false;

  @Select(StudioState.isExportModalOpen) isOpen$: Observable<boolean>;
  @Select(StudioState.getFileName) fileName$: Observable<string>;

  exportType: 'standard' | 'compressed' | 'flattened' | 'images' = 'standard';
  customFileName: string = 'edited_document.pdf';
  exporting: boolean = false;

  constructor(
    private store: Store,
    private pdfService: StudioPdfService
  ) {
    this.fileName$.subscribe(name => {
      if (name) {
        this.customFileName = name.replace('.pdf', '') + '_edited.pdf';
      }
    });
  }

  onClose() {
    this.store.dispatch(new ToggleExportModal(false));
  }

  async onExport() {
    this.exporting = true;
    this.store.dispatch(new SetStudioLoading(true, 'Baking PDF and preparing download...'));

    try {
      const state: StudioStateModel = this.store.selectSnapshot(StudioState.getState);
      const isCompressed = this.exportType === 'compressed';

      const pdfBytes = await this.pdfService.bakeDocument(state, {
        compress: isCompressed
      });

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.customFileName.endsWith('.pdf') ? this.customFileName : `${this.customFileName}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      this.onClose();
    } catch (err) {
      console.error('Export failed', err);
      alert('Failed to export PDF: ' + (err as any)?.message);
    } finally {
      this.exporting = false;
      this.store.dispatch(new SetStudioLoading(false));
    }
  }
}
