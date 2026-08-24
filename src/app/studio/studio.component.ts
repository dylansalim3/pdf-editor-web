import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { StudioState } from './store/studio.state';
import { 
  ClearStudioDocument, 
  LoadStudioDocument, 
  RedoStudioAction, 
  SetStudioLoading, 
  ToggleCommandPalette, 
  ToggleExportModal, 
  ToggleOrganizeModal, 
  UndoStudioAction 
} from './store/studio.actions';
import { StudioPdfService } from './services/studio-pdf.service';
import { PdfRotateState } from '../pdf-rotate/state/pdf-rotate.state';

@Component({
  selector: 'app-studio',
  templateUrl: './studio.component.html',
  styleUrls: ['./studio.component.css']
})
export class StudioComponent implements OnInit {
  @Select(StudioState.hasDocument) hasDocument$: Observable<boolean>;
  @Select(StudioState.isLoading) loadingState$: Observable<{ loading: boolean; message: string }>;

  darkMode: boolean = false;
  dragOver: boolean = false;

  constructor(
    private store: Store,
    private pdfService: StudioPdfService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check dark mode preference
    const savedTheme = localStorage.getItem('theme');
    this.darkMode = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // If legacy PdfRotateState has a file loaded, automatically migrate it into StudioState!
    const legacyFile = this.store.selectSnapshot(PdfRotateState.getBlobFile);
    const hasStudioDoc = this.store.selectSnapshot(StudioState.hasDocument);

    if (legacyFile && !hasStudioDoc) {
      this.loadFile(legacyFile, 'document.pdf');
    }
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
    const file = event.dataTransfer?.files?.[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.pdf'))) {
      this.loadFile(file, file.name);
    }
  }

  onFileInput(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.loadFile(file, file.name);
    }
  }

  async loadFile(input: File | string | ArrayBuffer, fileName: string) {
    this.store.dispatch(new SetStudioLoading(true, 'Analyzing and loading PDF into memory...'));

    try {
      const result = await this.pdfService.loadDocument(input);
      this.store.dispatch(new LoadStudioDocument({
        fileData: result.rawBuffer,
        fileName: result.fileName || fileName,
        fileSize: result.fileSize,
        pageCount: result.pageCount
      }));
    } catch (err) {
      console.error('Failed to load PDF', err);
      alert('Could not load PDF file: ' + (err as any)?.message);
    } finally {
      this.store.dispatch(new SetStudioLoading(false));
    }
  }

  async loadSamplePdf() {
    // Generate a simple multi-page sample PDF in memory
    this.store.dispatch(new SetStudioLoading(true, 'Generating sample multi-page PDF...'));
    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const subFont = await doc.embedFont(StandardFonts.Helvetica);

      // Page 1
      const page1 = doc.addPage([612, 792]);
      page1.drawText('Welcome to PDF Studio', { x: 50, y: 700, size: 28, font, color: rgb(0.31, 0.27, 0.9) });
      page1.drawText('This is an interactive, privacy-first PDF studio workspace.', { x: 50, y: 660, size: 14, font: subFont, color: rgb(0.2, 0.2, 0.3) });
      page1.drawText('Try: 1) Drawing or adding text overlays\n2) Inserting a signature\n3) Organizing, rotating, or duplicating pages\n4) Exporting with instant compression', { x: 50, y: 600, size: 12, font: subFont, color: rgb(0.4, 0.4, 0.5), lineHeight: 20 });

      // Page 2
      const page2 = doc.addPage([612, 792]);
      page2.drawText('Sample Document - Page 2', { x: 50, y: 700, size: 24, font, color: rgb(0.2, 0.2, 0.2) });
      page2.drawRectangle({ x: 50, y: 450, width: 512, height: 200, color: rgb(0.95, 0.96, 0.98), borderColor: rgb(0.8, 0.85, 0.9), borderWidth: 1 });
      page2.drawText('Invoice Summary & Agreement Area', { x: 70, y: 610, size: 16, font, color: rgb(0.3, 0.3, 0.4) });
      page2.drawText('Client Name: ACME Enterprise Inc.\nAgreement Date: 2026-08-22\nStatus: Pending Signature', { x: 70, y: 550, size: 12, font: subFont, color: rgb(0.3, 0.3, 0.3), lineHeight: 18 });

      // Page 3
      const page3 = doc.addPage([612, 792]);
      page3.drawText('Sample Document - Appendix & Notes', { x: 50, y: 700, size: 24, font, color: rgb(0.2, 0.2, 0.2) });
      page3.drawText('Page 3 demonstrates multi-page navigation and thumbnail reordering.', { x: 50, y: 660, size: 13, font: subFont, color: rgb(0.4, 0.4, 0.4) });

      const pdfBytes = await doc.save();
      await this.loadFile(pdfBytes.buffer, 'sample-studio-document.pdf');
    } catch (err) {
      console.error(err);
    } finally {
      this.store.dispatch(new SetStudioLoading(false));
    }
  }

  onResetDocument() {
    this.store.dispatch(new ClearStudioDocument());
  }

  @HostListener('document:keydown', ['$event'])
  handleGlobalShortcuts(event: KeyboardEvent) {
    // Only capture when not typing inside an input/textarea
    const target = event.target as HTMLElement;
    const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      if (event.shiftKey) {
        this.store.dispatch(new RedoStudioAction());
      } else {
        this.store.dispatch(new UndoStudioAction());
      }
    } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      this.store.dispatch(new ToggleExportModal(true));
    } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'o') {
      event.preventDefault();
      this.store.dispatch(new ToggleOrganizeModal(true));
    }
  }
}
