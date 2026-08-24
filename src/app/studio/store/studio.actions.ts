import { AnnotationItem, InspectorProperties, PageMetadata, StudioTool } from '../models/studio.model';

export class LoadStudioDocument {
  static readonly type = '[Studio] Load Document';
  constructor(public payload: { 
    fileData: ArrayBuffer | string; 
    fileName: string; 
    fileSize?: number;
    pageCount: number;
  }) {}
}

export class SetActivePage {
  static readonly type = '[Studio] Set Active Page';
  constructor(public pageIndex: number) {}
}

export class SetActiveTool {
  static readonly type = '[Studio] Set Active Tool';
  constructor(public tool: StudioTool) {}
}

export class SetZoomLevel {
  static readonly type = '[Studio] Set Zoom Level';
  constructor(public zoom: number) {}
}

export class RotatePage {
  static readonly type = '[Studio] Rotate Page';
  constructor(public pageIndex: number, public degrees: number = 90) {}
}

export class RotateAllPages {
  static readonly type = '[Studio] Rotate All Pages';
  constructor(public degrees: number = 90) {}
}

export class DeletePage {
  static readonly type = '[Studio] Delete Page';
  constructor(public pageIndex: number) {}
}

export class DeleteMultiplePages {
  static readonly type = '[Studio] Delete Multiple Pages';
  constructor(public pageIndexes: number[]) {}
}

export class ReorderPages {
  static readonly type = '[Studio] Reorder Pages';
  constructor(public pageOrder: PageMetadata[]) {}
}

export class DuplicatePage {
  static readonly type = '[Studio] Duplicate Page';
  constructor(public pageIndex: number) {}
}

export class InsertBlankPage {
  static readonly type = '[Studio] Insert Blank Page';
  constructor(public atIndex: number) {}
}

export class AddAnnotation {
  static readonly type = '[Studio] Add Annotation';
  constructor(public annotation: AnnotationItem) {}
}

export class UpdateAnnotation {
  static readonly type = '[Studio] Update Annotation';
  constructor(public payload: Partial<AnnotationItem> & { id: string }) {}
}

export class DeleteAnnotation {
  static readonly type = '[Studio] Delete Annotation';
  constructor(public annotationId: string) {}
}

export class SelectAnnotation {
  static readonly type = '[Studio] Select Annotation';
  constructor(public annotationId: string | null) {}
}

export class UpdateInspectorProperties {
  static readonly type = '[Studio] Update Inspector Properties';
  constructor(public properties: Partial<InspectorProperties>) {}
}

export class UndoStudioAction {
  static readonly type = '[Studio] Undo Action';
}

export class RedoStudioAction {
  static readonly type = '[Studio] Redo Action';
}

export class ToggleOrganizeModal {
  static readonly type = '[Studio] Toggle Organize Modal';
  constructor(public open?: boolean) {}
}

export class ToggleSignatureModal {
  static readonly type = '[Studio] Toggle Signature Modal';
  constructor(public open?: boolean) {}
}

export class ToggleExportModal {
  static readonly type = '[Studio] Toggle Export Modal';
  constructor(public open?: boolean) {}
}

export class ToggleCommandPalette {
  static readonly type = '[Studio] Toggle Command Palette';
  constructor(public open?: boolean) {}
}

export class SetStudioLoading {
  static readonly type = '[Studio] Set Loading';
  constructor(public loading: boolean, public message: string = '') {}
}

export class ClearStudioDocument {
  static readonly type = '[Studio] Clear Document';
}
