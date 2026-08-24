import { 
  Component, 
  ElementRef, 
  Input, 
  OnInit, 
  ViewChild, 
  AfterViewInit 
} from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AnnotationItem } from '../../models/studio.model';
import { StudioState } from '../../store/studio.state';
import { AddAnnotation, ToggleSignatureModal } from '../../store/studio.actions';

@Component({
  selector: 'app-signature-modal',
  templateUrl: './signature-modal.component.html',
  styleUrls: ['./signature-modal.component.css']
})
export class SignatureModalComponent implements OnInit, AfterViewInit {
  @Input() darkMode: boolean = false;

  @ViewChild('sigCanvas', { static: false }) sigCanvasRef!: ElementRef<HTMLCanvasElement>;

  @Select(StudioState.isSignatureModalOpen) isOpen$: Observable<boolean>;
  @Select(StudioState.getActivePageIndex) activePageIndex$: Observable<number>;

  activeTab: 'draw' | 'type' | 'upload' = 'draw';

  // Draw State
  isDrawing = false;
  sigColor: string = '#000000';
  sigColors: string[] = ['#000000', '#1e3a8a', '#4f46e5', '#334155'];

  // Type State
  typedText: string = 'Alex Taylor';
  selectedFont: string = 'Caveat, cursive';
  fonts: { name: string; style: string }[] = [
    { name: 'Casual Hand', style: 'Caveat, cursive' },
    { name: 'Elegant Script', style: 'Dancing Script, cursive' },
    { name: 'Formal Calligraphy', style: 'Great Vibes, cursive' },
    { name: 'Modern Brush', style: 'Pacifico, cursive' }
  ];

  // Upload State
  uploadedImage: string | null = null;

  constructor(private store: Store) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.isOpen$.subscribe(open => {
      if (open && this.activeTab === 'draw') {
        setTimeout(() => this.initCanvas(), 100);
      }
    });
  }

  setTab(tab: 'draw' | 'type' | 'upload') {
    this.activeTab = tab;
    if (tab === 'draw') {
      setTimeout(() => this.initCanvas(), 100);
    }
  }

  initCanvas() {
    if (!this.sigCanvasRef) return;
    const canvas = this.sigCanvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 500;
    canvas.height = 180;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.sigColor;
  }

  onMouseDown(e: MouseEvent) {
    this.isDrawing = true;
    const canvas = this.sigCanvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }

  onMouseMove(e: MouseEvent) {
    if (!this.isDrawing) return;
    const canvas = this.sigCanvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = this.sigColor;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  }

  onMouseUp() {
    this.isDrawing = false;
  }

  clearCanvas() {
    if (!this.sigCanvasRef) return;
    const canvas = this.sigCanvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.uploadedImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  generateTypedSignatureDataUrl(): string {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.font = `44px ${this.selectedFont}`;
    ctx.fillStyle = this.sigColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.typedText || 'Signature', 250, 80);

    return canvas.toDataURL('image/png');
  }

  onApply() {
    let dataUrl = '';

    if (this.activeTab === 'draw' && this.sigCanvasRef) {
      dataUrl = this.sigCanvasRef.nativeElement.toDataURL('image/png');
    } else if (this.activeTab === 'type') {
      dataUrl = this.generateTypedSignatureDataUrl();
    } else if (this.activeTab === 'upload' && this.uploadedImage) {
      dataUrl = this.uploadedImage;
    }

    if (!dataUrl) return;

    const activePage = this.store.selectSnapshot(StudioState.getActivePageIndex);
    const newAnn: AnnotationItem = {
      id: `sig-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      pageIndex: activePage,
      type: 'signature',
      x: 35,
      y: 65,
      width: 30,
      height: 12,
      color: this.sigColor,
      dataUrl
    };

    this.store.dispatch(new AddAnnotation(newAnn));
    this.onClose();
  }

  onClose() {
    this.store.dispatch(new ToggleSignatureModal(false));
  }
}
