import { 
  Component, 
  ElementRef, 
  Input, 
  OnDestroy, 
  OnInit, 
  ViewChild, 
  AfterViewInit, 
  HostListener 
} from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { 
  AnnotationItem, 
  AnnotationType,
  InspectorProperties, 
  PageMetadata, 
  StudioTool 
} from '../../models/studio.model';
import { StudioState } from '../../store/studio.state';
import { 
  AddAnnotation, 
  DeleteAnnotation, 
  SelectAnnotation, 
  UpdateAnnotation 
} from '../../store/studio.actions';
import { StudioPdfService } from '../../services/studio-pdf.service';

@Component({
  selector: 'app-studio-canvas',
  templateUrl: './studio-canvas.component.html',
  styleUrls: ['./studio-canvas.component.css']
})
export class StudioCanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() darkMode: boolean = false;

  @ViewChild('pdfCanvas', { static: false }) pdfCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasContainer', { static: false }) containerRef!: ElementRef<HTMLDivElement>;

  @Select(StudioState.getActivePageIndex) activePageIndex$: Observable<number>;
  @Select(StudioState.getPageOrder) pageOrder$: Observable<PageMetadata[]>;
  @Select(StudioState.getActiveTool) activeTool$: Observable<StudioTool>;
  @Select(StudioState.getZoomLevel) zoomLevel$: Observable<number>;
  @Select(StudioState.getActivePageAnnotations) activeAnnotations$: Observable<AnnotationItem[]>;
  @Select(StudioState.getSelectedAnnotation) selectedAnnotation$: Observable<AnnotationItem | undefined>;
  @Select(StudioState.getInspectorProperties) inspectorProps$: Observable<InspectorProperties>;

  canvasWidth = 612;
  canvasHeight = 792;
  rendering = false;

  // Drawing state
  isDrawing = false;
  currentPath = '';
  drawStartX = 0;
  drawStartY = 0;

  // Dragging / Resizing annotation state
  isDraggingAnnotation = false;
  isResizingAnnotation = false;
  resizeHandle = '';
  dragStartX = 0;
  dragStartY = 0;
  initialAnnState: Partial<AnnotationItem> = {};

  // Pan state
  isPanning = false;
  panStartX = 0;
  panStartY = 0;
  scrollStartX = 0;
  scrollStartY = 0;

  private subs: Subscription = new Subscription();

  constructor(
    private store: Store,
    private pdfService: StudioPdfService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Listen for state changes to re-render page canvas
    this.subs.add(
      this.activePageIndex$.subscribe(() => this.triggerRender())
    );
    this.subs.add(
      this.pageOrder$.subscribe(() => this.triggerRender())
    );
    this.subs.add(
      this.zoomLevel$.subscribe(() => this.triggerRender())
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  async triggerRender() {
    if (!this.pdfCanvasRef) return;

    const pageOrder = this.store.selectSnapshot(StudioState.getPageOrder);
    const activeIndex = this.store.selectSnapshot(StudioState.getActivePageIndex);
    const zoom = this.store.selectSnapshot(StudioState.getZoomLevel) / 100;
    const pageMeta = pageOrder[activeIndex];

    if (!pageMeta) return;

    const canvas = this.pdfCanvasRef.nativeElement;
    const context = canvas.getContext('2d');
    if (!context) return;

    this.rendering = true;

    if (pageMeta.isBlank) {
      // US Letter standard (8.5 x 11 in) at 72dpi * 1.5 base scale
      const baseW = 612 * 1.5;
      const baseH = 792 * 1.5;
      this.canvasWidth = baseW * zoom;
      this.canvasHeight = baseH * zoom;
      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.rendering = false;
      return;
    }

    try {
      const result = await this.pdfService.renderPageToCanvas(
        pageMeta.originalIndex + 1,
        pageMeta.rotation,
        1.5 * zoom,
        canvas
      );
      this.canvasWidth = result.width;
      this.canvasHeight = result.height;
    } catch (err) {
      console.error('Canvas render error', err);
    } finally {
      this.rendering = false;
    }
  }

  getRelativeCoords(event: MouseEvent): { x: number; y: number } {
    const rect = this.pdfCanvasRef.nativeElement.getBoundingClientRect();
    const clientX = event.clientX - rect.left;
    const clientY = event.clientY - rect.top;
    return {
      x: Math.max(0, Math.min((clientX / rect.width) * 100, 100)),
      y: Math.max(0, Math.min((clientY / rect.height) * 100, 100))
    };
  }

  onMouseDown(event: MouseEvent) {
    const tool = this.store.selectSnapshot(StudioState.getActiveTool);
    const coords = this.getRelativeCoords(event);

    if (tool === 'pan') {
      this.isPanning = true;
      this.panStartX = event.clientX;
      this.panStartY = event.clientY;
      if (this.containerRef) {
        this.scrollStartX = this.containerRef.nativeElement.scrollLeft;
        this.scrollStartY = this.containerRef.nativeElement.scrollTop;
      }
      return;
    }

    if (tool === 'text') {
      this.addTextAnnotation(coords.x, coords.y);
      return;
    }

    if (tool === 'watermark') {
      this.addWatermarkAnnotation(coords.x, coords.y);
      return;
    }

    if (['draw', 'highlight', 'rectangle', 'circle', 'redact'].includes(tool)) {
      this.isDrawing = true;
      this.drawStartX = coords.x;
      this.drawStartY = coords.y;
      this.currentPath = `M ${coords.x} ${coords.y}`;
    }
  }

  onMouseMove(event: MouseEvent) {
    const tool = this.store.selectSnapshot(StudioState.getActiveTool);

    if (this.isPanning && this.containerRef) {
      const dx = event.clientX - this.panStartX;
      const dy = event.clientY - this.panStartY;
      this.containerRef.nativeElement.scrollLeft = this.scrollStartX - dx;
      this.containerRef.nativeElement.scrollTop = this.scrollStartY - dy;
      return;
    }

    if (!this.isDrawing) return;

    const coords = this.getRelativeCoords(event);

    if (tool === 'draw' || tool === 'highlight') {
      this.currentPath += ` L ${coords.x} ${coords.y}`;
    }
  }

  onMouseUp(event: MouseEvent) {
    if (this.isPanning) {
      this.isPanning = false;
      return;
    }

    if (!this.isDrawing) return;
    this.isDrawing = false;

    const tool = this.store.selectSnapshot(StudioState.getActiveTool);
    const inspector = this.store.selectSnapshot(StudioState.getInspectorProperties);
    const activePage = this.store.selectSnapshot(StudioState.getActivePageIndex);
    const coords = this.getRelativeCoords(event);

    const minX = Math.min(this.drawStartX, coords.x);
    const minY = Math.min(this.drawStartY, coords.y);
    const width = Math.max(Math.abs(coords.x - this.drawStartX), 2);
    const height = Math.max(Math.abs(coords.y - this.drawStartY), 2);

    if (tool === 'draw' || tool === 'highlight') {
      if (this.currentPath) {
        const newAnn: AnnotationItem = {
          id: `ann-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          pageIndex: activePage,
          type: tool,
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          color: tool === 'highlight' ? '#fde047' : inspector.color,
          strokeWidth: tool === 'highlight' ? 12 : inspector.strokeWidth,
          opacity: tool === 'highlight' ? 0.35 : inspector.opacity,
          svgPath: this.currentPath
        };
        this.store.dispatch(new AddAnnotation(newAnn));
        this.currentPath = '';
      }
    } else if (['rectangle', 'circle', 'redact'].includes(tool)) {
      const newAnn: AnnotationItem = {
        id: `ann-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        pageIndex: activePage,
        type: tool as AnnotationType,
        x: minX,
        y: minY,
        width,
        height,
        color: tool === 'redact' ? '#000000' : inspector.color,
        strokeWidth: inspector.strokeWidth,
        opacity: tool === 'redact' ? 1 : inspector.opacity
      };
      this.store.dispatch(new AddAnnotation(newAnn));
    }
  }

  addTextAnnotation(x: number, y: number) {
    const inspector = this.store.selectSnapshot(StudioState.getInspectorProperties);
    const activePage = this.store.selectSnapshot(StudioState.getActivePageIndex);

    const newAnn: AnnotationItem = {
      id: `ann-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      pageIndex: activePage,
      type: 'text',
      x: Math.min(x, 80),
      y: Math.min(y, 90),
      width: 25,
      height: 6,
      text: 'Click to edit text',
      color: inspector.color,
      fontSize: inspector.fontSize,
      fontFamily: inspector.fontFamily,
      opacity: inspector.opacity
    };

    this.store.dispatch(new AddAnnotation(newAnn));
  }

  addWatermarkAnnotation(x: number, y: number) {
    const inspector = this.store.selectSnapshot(StudioState.getInspectorProperties);
    const activePage = this.store.selectSnapshot(StudioState.getActivePageIndex);

    const newAnn: AnnotationItem = {
      id: `ann-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      pageIndex: activePage,
      type: 'watermark',
      x: 10,
      y: 40,
      width: 80,
      height: 20,
      text: inspector.watermarkText || 'CONFIDENTIAL',
      color: inspector.color,
      fontSize: 36,
      rotation: inspector.watermarkAngle ?? 45,
      opacity: 0.2
    };

    this.store.dispatch(new AddAnnotation(newAnn));
  }

  onSelectAnnotation(ann: AnnotationItem, event: MouseEvent) {
    event.stopPropagation();
    this.store.dispatch(new SelectAnnotation(ann.id));
  }

  onStartDragAnnotation(ann: AnnotationItem, event: MouseEvent) {
    event.stopPropagation();
    this.isDraggingAnnotation = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.initialAnnState = { ...ann };
  }

  onTextChange(ann: AnnotationItem, text: string) {
    this.store.dispatch(new UpdateAnnotation({ id: ann.id, text }));
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvents(event: KeyboardEvent) {
    const selected = this.store.selectSnapshot(StudioState.getSelectedAnnotation);
    if ((event.key === 'Delete' || event.key === 'Backspace') && selected) {
      // If not currently typing in an input
      const target = event.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        this.store.dispatch(new DeleteAnnotation(selected.id));
      }
    }
  }
}
