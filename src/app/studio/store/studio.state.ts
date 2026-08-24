import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  AnnotationItem,
  InspectorProperties,
  PageMetadata,
  StudioHistorySnapshot,
  StudioStateModel
} from '../models/studio.model';
import {
  AddAnnotation,
  ClearStudioDocument,
  DeleteAnnotation,
  DeleteMultiplePages,
  DeletePage,
  DuplicatePage,
  InsertBlankPage,
  LoadStudioDocument,
  RedoStudioAction,
  ReorderPages,
  RotateAllPages,
  RotatePage,
  SelectAnnotation,
  SetActivePage,
  SetActiveTool,
  SetStudioLoading,
  SetZoomLevel,
  ToggleCommandPalette,
  ToggleExportModal,
  ToggleOrganizeModal,
  ToggleSignatureModal,
  UndoStudioAction,
  UpdateAnnotation,
  UpdateInspectorProperties
} from './studio.actions';

const DEFAULT_INSPECTOR: InspectorProperties = {
  color: '#4f46e5',
  strokeWidth: 3,
  fontSize: 16,
  fontFamily: 'Helvetica',
  opacity: 1,
  fillColor: '#4f46e5',
  watermarkText: 'CONFIDENTIAL',
  watermarkAngle: 45
};

const DEFAULT_STATE: StudioStateModel = {
  fileName: '',
  fileSize: 0,
  rawBuffer: null,
  base64Data: null,
  pageCount: 0,
  pageOrder: [],
  annotations: [],
  activePageIndex: 0,
  activeTool: 'select',
  selectedAnnotationId: null,
  zoomLevel: 100,
  isOrganizeModalOpen: false,
  isSignatureModalOpen: false,
  isExportModalOpen: false,
  isCommandPaletteOpen: false,
  inspectorProperties: DEFAULT_INSPECTOR,
  history: [],
  historyIndex: -1,
  loading: false,
  loadingMessage: ''
};

const MAX_HISTORY = 20;

function createSnapshot(pageOrder: PageMetadata[], annotations: AnnotationItem[]): StudioHistorySnapshot {
  return {
    pageOrder: JSON.parse(JSON.stringify(pageOrder)),
    annotations: JSON.parse(JSON.stringify(annotations))
  };
}

@State<StudioStateModel>({
  name: 'STUDIO_DOCUMENT',
  defaults: DEFAULT_STATE
})
@Injectable()
export class StudioState {
  @Selector()
  static getState(state: StudioStateModel): StudioStateModel {
    return state;
  }

  @Selector()
  static hasDocument(state: StudioStateModel): boolean {
    return !!state.base64Data || !!state.rawBuffer;
  }

  @Selector()
  static getBase64Data(state: StudioStateModel): string | null {
    return state.base64Data;
  }

  @Selector()
  static getFileName(state: StudioStateModel): string {
    return state.fileName || 'Untitled.pdf';
  }

  @Selector()
  static getPageOrder(state: StudioStateModel): PageMetadata[] {
    return state.pageOrder;
  }

  @Selector()
  static getActivePageMetadata(state: StudioStateModel): PageMetadata | undefined {
    return state.pageOrder[state.activePageIndex];
  }

  @Selector()
  static getActivePageIndex(state: StudioStateModel): number {
    return state.activePageIndex;
  }

  @Selector()
  static getActiveTool(state: StudioStateModel) {
    return state.activeTool;
  }

  @Selector()
  static getZoomLevel(state: StudioStateModel): number {
    return state.zoomLevel;
  }

  @Selector()
  static getAnnotations(state: StudioStateModel): AnnotationItem[] {
    return state.annotations;
  }

  @Selector()
  static getActivePageAnnotations(state: StudioStateModel): AnnotationItem[] {
    return state.annotations.filter(a => a.pageIndex === state.activePageIndex);
  }

  @Selector()
  static getSelectedAnnotation(state: StudioStateModel): AnnotationItem | undefined {
    return state.annotations.find(a => a.id === state.selectedAnnotationId);
  }

  @Selector()
  static getInspectorProperties(state: StudioStateModel): InspectorProperties {
    return state.inspectorProperties;
  }

  @Selector()
  static canUndo(state: StudioStateModel): boolean {
    return state.historyIndex > 0;
  }

  @Selector()
  static canRedo(state: StudioStateModel): boolean {
    return state.historyIndex < state.history.length - 1;
  }

  @Selector()
  static isOrganizeModalOpen(state: StudioStateModel): boolean {
    return state.isOrganizeModalOpen;
  }

  @Selector()
  static isSignatureModalOpen(state: StudioStateModel): boolean {
    return state.isSignatureModalOpen;
  }

  @Selector()
  static isExportModalOpen(state: StudioStateModel): boolean {
    return state.isExportModalOpen;
  }

  @Selector()
  static isCommandPaletteOpen(state: StudioStateModel): boolean {
    return state.isCommandPaletteOpen;
  }

  @Selector()
  static isLoading(state: StudioStateModel): { loading: boolean; message: string } {
    return { loading: state.loading, message: state.loadingMessage };
  }

  private pushHistory(state: StudioStateModel, newPageOrder: PageMetadata[], newAnnotations: AnnotationItem[]) {
    const trimmedHistory = state.history.slice(0, state.historyIndex + 1);
    const newSnapshot = createSnapshot(newPageOrder, newAnnotations);
    const updatedHistory = [...trimmedHistory, newSnapshot].slice(-MAX_HISTORY);
    return {
      history: updatedHistory,
      historyIndex: updatedHistory.length - 1
    };
  }

  @Action(LoadStudioDocument)
  loadStudioDocument(ctx: StateContext<StudioStateModel>, action: LoadStudioDocument) {
    const { fileData, fileName, fileSize, pageCount } = action.payload;
    const pageOrder: PageMetadata[] = Array.from({ length: pageCount }, (_, i) => ({
      id: `page-${i + 1}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      originalIndex: i,
      rotation: 0,
      deleted: false
    }));

    const isBuffer = fileData instanceof ArrayBuffer;
    const rawBuffer: ArrayBuffer | null = isBuffer ? (fileData as ArrayBuffer) : null;
    const base64Data: string | null = typeof fileData === 'string' ? fileData : null;

    const initialSnapshot = createSnapshot(pageOrder, []);

    ctx.setState({
      ...DEFAULT_STATE,
      fileName,
      fileSize: fileSize || 0,
      rawBuffer,
      base64Data,
      pageCount,
      pageOrder,
      annotations: [],
      activePageIndex: 0,
      activeTool: 'select',
      history: [initialSnapshot],
      historyIndex: 0
    });
  }

  @Action(SetActivePage)
  setActivePage(ctx: StateContext<StudioStateModel>, action: SetActivePage) {
    const state = ctx.getState();
    if (action.pageIndex >= 0 && action.pageIndex < state.pageOrder.length) {
      ctx.patchState({
        activePageIndex: action.pageIndex,
        selectedAnnotationId: null
      });
    }
  }

  @Action(SetActiveTool)
  setActiveTool(ctx: StateContext<StudioStateModel>, action: SetActiveTool) {
    ctx.patchState({
      activeTool: action.tool,
      selectedAnnotationId: action.tool === 'select' ? ctx.getState().selectedAnnotationId : null
    });
  }

  @Action(SetZoomLevel)
  setZoomLevel(ctx: StateContext<StudioStateModel>, action: SetZoomLevel) {
    const zoom = Math.min(Math.max(action.zoom, 25), 300);
    ctx.patchState({ zoomLevel: zoom });
  }

  @Action(RotatePage)
  rotatePage(ctx: StateContext<StudioStateModel>, action: RotatePage) {
    const state = ctx.getState();
    const newPageOrder = state.pageOrder.map((page, idx) => {
      if (idx === action.pageIndex) {
        const newRotation = (page.rotation + action.degrees + 360) % 360;
        return { ...page, rotation: newRotation };
      }
      return page;
    });

    const historyUpdate = this.pushHistory(state, newPageOrder, state.annotations);
    ctx.patchState({
      pageOrder: newPageOrder,
      ...historyUpdate
    });
  }

  @Action(RotateAllPages)
  rotateAllPages(ctx: StateContext<StudioStateModel>, action: RotateAllPages) {
    const state = ctx.getState();
    const newPageOrder = state.pageOrder.map(page => ({
      ...page,
      rotation: (page.rotation + action.degrees + 360) % 360
    }));

    const historyUpdate = this.pushHistory(state, newPageOrder, state.annotations);
    ctx.patchState({
      pageOrder: newPageOrder,
      ...historyUpdate
    });
  }

  @Action(DeletePage)
  deletePage(ctx: StateContext<StudioStateModel>, action: DeletePage) {
    const state = ctx.getState();
    if (state.pageOrder.length <= 1) return; // Keep at least 1 page

    const newPageOrder = state.pageOrder.filter((_, idx) => idx !== action.pageIndex);
    // Remove annotations on that page, and adjust pageIndex on subsequent annotations
    const newAnnotations = state.annotations
      .filter(a => a.pageIndex !== action.pageIndex)
      .map(a => a.pageIndex > action.pageIndex ? { ...a, pageIndex: a.pageIndex - 1 } : a);

    const newActiveIndex = Math.min(state.activePageIndex, newPageOrder.length - 1);
    const historyUpdate = this.pushHistory(state, newPageOrder, newAnnotations);

    ctx.patchState({
      pageOrder: newPageOrder,
      annotations: newAnnotations,
      activePageIndex: newActiveIndex,
      selectedAnnotationId: null,
      ...historyUpdate
    });
  }

  @Action(DeleteMultiplePages)
  deleteMultiplePages(ctx: StateContext<StudioStateModel>, action: DeleteMultiplePages) {
    const state = ctx.getState();
    const deleteSet = new Set(action.pageIndexes);
    if (deleteSet.size >= state.pageOrder.length) return; // Don't delete all pages

    const newPageOrder = state.pageOrder.filter((_, idx) => !deleteSet.has(idx));
    
    // Remap remaining page indexes
    const indexMap = new Map<number, number>();
    let currentIndex = 0;
    for (let i = 0; i < state.pageOrder.length; i++) {
      if (!deleteSet.has(i)) {
        indexMap.set(i, currentIndex++);
      }
    }

    const newAnnotations = state.annotations
      .filter(a => !deleteSet.has(a.pageIndex))
      .map(a => ({ ...a, pageIndex: indexMap.get(a.pageIndex) ?? 0 }));

    const newActiveIndex = Math.min(state.activePageIndex, newPageOrder.length - 1);
    const historyUpdate = this.pushHistory(state, newPageOrder, newAnnotations);

    ctx.patchState({
      pageOrder: newPageOrder,
      annotations: newAnnotations,
      activePageIndex: newActiveIndex,
      selectedAnnotationId: null,
      ...historyUpdate
    });
  }

  @Action(ReorderPages)
  reorderPages(ctx: StateContext<StudioStateModel>, action: ReorderPages) {
    const state = ctx.getState();
    const historyUpdate = this.pushHistory(state, action.pageOrder, state.annotations);
    ctx.patchState({
      pageOrder: action.pageOrder,
      ...historyUpdate
    });
  }

  @Action(DuplicatePage)
  duplicatePage(ctx: StateContext<StudioStateModel>, action: DuplicatePage) {
    const state = ctx.getState();
    const targetPage = state.pageOrder[action.pageIndex];
    if (!targetPage) return;

    const duplicated: PageMetadata = {
      ...targetPage,
      id: `page-dup-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    };

    const newPageOrder = [
      ...state.pageOrder.slice(0, action.pageIndex + 1),
      duplicated,
      ...state.pageOrder.slice(action.pageIndex + 1)
    ];

    // Shift annotations on pages after inserted page
    const newAnnotations = state.annotations.map(a => 
      a.pageIndex > action.pageIndex ? { ...a, pageIndex: a.pageIndex + 1 } : a
    );

    const historyUpdate = this.pushHistory(state, newPageOrder, newAnnotations);
    ctx.patchState({
      pageOrder: newPageOrder,
      annotations: newAnnotations,
      activePageIndex: action.pageIndex + 1,
      ...historyUpdate
    });
  }

  @Action(InsertBlankPage)
  insertBlankPage(ctx: StateContext<StudioStateModel>, action: InsertBlankPage) {
    const state = ctx.getState();
    const blankPage: PageMetadata = {
      id: `page-blank-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      originalIndex: -1,
      rotation: 0,
      deleted: false,
      isBlank: true
    };

    const insertAt = Math.min(Math.max(action.atIndex, 0), state.pageOrder.length);
    const newPageOrder = [
      ...state.pageOrder.slice(0, insertAt),
      blankPage,
      ...state.pageOrder.slice(insertAt)
    ];

    const newAnnotations = state.annotations.map(a => 
      a.pageIndex >= insertAt ? { ...a, pageIndex: a.pageIndex + 1 } : a
    );

    const historyUpdate = this.pushHistory(state, newPageOrder, newAnnotations);
    ctx.patchState({
      pageOrder: newPageOrder,
      annotations: newAnnotations,
      activePageIndex: insertAt,
      ...historyUpdate
    });
  }

  @Action(AddAnnotation)
  addAnnotation(ctx: StateContext<StudioStateModel>, action: AddAnnotation) {
    const state = ctx.getState();
    const newAnnotations = [...state.annotations, action.annotation];
    const historyUpdate = this.pushHistory(state, state.pageOrder, newAnnotations);
    ctx.patchState({
      annotations: newAnnotations,
      selectedAnnotationId: action.annotation.id,
      ...historyUpdate
    });
  }

  @Action(UpdateAnnotation)
  updateAnnotation(ctx: StateContext<StudioStateModel>, action: UpdateAnnotation) {
    const state = ctx.getState();
    const newAnnotations = state.annotations.map(a => 
      a.id === action.payload.id ? { ...a, ...action.payload } : a
    );
    const historyUpdate = this.pushHistory(state, state.pageOrder, newAnnotations);
    ctx.patchState({
      annotations: newAnnotations,
      ...historyUpdate
    });
  }

  @Action(DeleteAnnotation)
  deleteAnnotation(ctx: StateContext<StudioStateModel>, action: DeleteAnnotation) {
    const state = ctx.getState();
    const newAnnotations = state.annotations.filter(a => a.id !== action.annotationId);
    const historyUpdate = this.pushHistory(state, state.pageOrder, newAnnotations);
    ctx.patchState({
      annotations: newAnnotations,
      selectedAnnotationId: null,
      ...historyUpdate
    });
  }

  @Action(SelectAnnotation)
  selectAnnotation(ctx: StateContext<StudioStateModel>, action: SelectAnnotation) {
    ctx.patchState({ selectedAnnotationId: action.annotationId });
  }

  @Action(UpdateInspectorProperties)
  updateInspectorProperties(ctx: StateContext<StudioStateModel>, action: UpdateInspectorProperties) {
    const state = ctx.getState();
    const updatedProps = { ...state.inspectorProperties, ...action.properties };
    
    // If an annotation is currently selected, update its properties in real-time
    let updatedAnnotations = state.annotations;
    if (state.selectedAnnotationId) {
      updatedAnnotations = state.annotations.map(a => {
        if (a.id === state.selectedAnnotationId) {
          return {
            ...a,
            color: action.properties.color ?? a.color,
            strokeWidth: action.properties.strokeWidth ?? a.strokeWidth,
            fontSize: action.properties.fontSize ?? a.fontSize,
            fontFamily: action.properties.fontFamily ?? a.fontFamily,
            opacity: action.properties.opacity ?? a.opacity,
            text: (a.type === 'watermark' && action.properties.watermarkText) ? action.properties.watermarkText : a.text,
            rotation: (a.type === 'watermark' && action.properties.watermarkAngle !== undefined) ? action.properties.watermarkAngle : a.rotation
          };
        }
        return a;
      });
    }

    ctx.patchState({
      inspectorProperties: updatedProps,
      annotations: updatedAnnotations
    });
  }

  @Action(UndoStudioAction)
  undoStudioAction(ctx: StateContext<StudioStateModel>) {
    const state = ctx.getState();
    if (state.historyIndex > 0) {
      const prevIndex = state.historyIndex - 1;
      const snapshot = state.history[prevIndex];
      ctx.patchState({
        pageOrder: JSON.parse(JSON.stringify(snapshot.pageOrder)),
        annotations: JSON.parse(JSON.stringify(snapshot.annotations)),
        historyIndex: prevIndex,
        selectedAnnotationId: null,
        activePageIndex: Math.min(state.activePageIndex, snapshot.pageOrder.length - 1)
      });
    }
  }

  @Action(RedoStudioAction)
  redoStudioAction(ctx: StateContext<StudioStateModel>) {
    const state = ctx.getState();
    if (state.historyIndex < state.history.length - 1) {
      const nextIndex = state.historyIndex + 1;
      const snapshot = state.history[nextIndex];
      ctx.patchState({
        pageOrder: JSON.parse(JSON.stringify(snapshot.pageOrder)),
        annotations: JSON.parse(JSON.stringify(snapshot.annotations)),
        historyIndex: nextIndex,
        selectedAnnotationId: null,
        activePageIndex: Math.min(state.activePageIndex, snapshot.pageOrder.length - 1)
      });
    }
  }

  @Action(ToggleOrganizeModal)
  toggleOrganizeModal(ctx: StateContext<StudioStateModel>, action: ToggleOrganizeModal) {
    const current = ctx.getState().isOrganizeModalOpen;
    ctx.patchState({ isOrganizeModalOpen: action.open !== undefined ? action.open : !current });
  }

  @Action(ToggleSignatureModal)
  toggleSignatureModal(ctx: StateContext<StudioStateModel>, action: ToggleSignatureModal) {
    const current = ctx.getState().isSignatureModalOpen;
    ctx.patchState({ isSignatureModalOpen: action.open !== undefined ? action.open : !current });
  }

  @Action(ToggleExportModal)
  toggleExportModal(ctx: StateContext<StudioStateModel>, action: ToggleExportModal) {
    const current = ctx.getState().isExportModalOpen;
    ctx.patchState({ isExportModalOpen: action.open !== undefined ? action.open : !current });
  }

  @Action(ToggleCommandPalette)
  toggleCommandPalette(ctx: StateContext<StudioStateModel>, action: ToggleCommandPalette) {
    const current = ctx.getState().isCommandPaletteOpen;
    ctx.patchState({ isCommandPaletteOpen: action.open !== undefined ? action.open : !current });
  }

  @Action(SetStudioLoading)
  setStudioLoading(ctx: StateContext<StudioStateModel>, action: SetStudioLoading) {
    ctx.patchState({
      loading: action.loading,
      loadingMessage: action.message
    });
  }

  @Action(ClearStudioDocument)
  clearStudioDocument(ctx: StateContext<StudioStateModel>) {
    ctx.setState(DEFAULT_STATE);
  }
}
