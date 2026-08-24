export type StudioTool =
  | 'select'
  | 'pan'
  | 'text'
  | 'draw'
  | 'highlight'
  | 'rectangle'
  | 'circle'
  | 'signature'
  | 'watermark'
  | 'redact'
  | 'organize';

export type AnnotationType =
  | 'text'
  | 'draw'
  | 'highlight'
  | 'rectangle'
  | 'circle'
  | 'signature'
  | 'watermark'
  | 'redact';

export interface PageMetadata {
  id: string;
  originalIndex: number;
  rotation: number; // 0, 90, 180, 270
  deleted: boolean;
  isBlank?: boolean;
}

export interface AnnotationItem {
  id: string;
  pageIndex: number; // Index in active pageOrder
  type: AnnotationType;
  x: number; // Percentage relative to page (0-100) or pt
  y: number;
  width: number;
  height: number;
  color: string;
  strokeWidth?: number;
  opacity?: number;
  fontSize?: number;
  fontFamily?: string;
  text?: string;
  svgPath?: string; // For freehand pen & highlighter
  dataUrl?: string; // For signature or stamp images
  rotation?: number; // For watermark rotation
  isLocked?: boolean;
}

export interface StudioHistorySnapshot {
  pageOrder: PageMetadata[];
  annotations: AnnotationItem[];
}

export interface InspectorProperties {
  color: string;
  strokeWidth: number;
  fontSize: number;
  fontFamily: string;
  opacity: number;
  fillColor?: string;
  watermarkText?: string;
  watermarkAngle?: number;
}

export interface StudioStateModel {
  fileName: string;
  fileSize: number;
  rawBuffer: ArrayBuffer | null;
  base64Data: string | null;
  pageCount: number;
  pageOrder: PageMetadata[];
  annotations: AnnotationItem[];
  activePageIndex: number;
  activeTool: StudioTool;
  selectedAnnotationId: string | null;
  zoomLevel: number;
  isOrganizeModalOpen: boolean;
  isSignatureModalOpen: boolean;
  isExportModalOpen: boolean;
  isCommandPaletteOpen: boolean;
  inspectorProperties: InspectorProperties;
  history: StudioHistorySnapshot[];
  historyIndex: number;
  loading: boolean;
  loadingMessage: string;
}

export interface SignatureData {
  type: 'draw' | 'type' | 'upload';
  dataUrl: string;
  text?: string;
  fontFamily?: string;
}
