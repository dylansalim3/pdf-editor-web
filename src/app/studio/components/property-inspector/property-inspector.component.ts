import { Component, Input } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AnnotationItem, InspectorProperties, StudioTool } from '../../models/studio.model';
import { StudioState } from '../../store/studio.state';
import { DeleteAnnotation, SelectAnnotation, UpdateInspectorProperties } from '../../store/studio.actions';

@Component({
  selector: 'app-property-inspector',
  templateUrl: './property-inspector.component.html',
  styleUrls: ['./property-inspector.component.css']
})
export class PropertyInspectorComponent {
  @Input() darkMode: boolean = false;

  @Select(StudioState.getActiveTool) activeTool$: Observable<StudioTool>;
  @Select(StudioState.getSelectedAnnotation) selectedAnnotation$: Observable<AnnotationItem | undefined>;
  @Select(StudioState.getInspectorProperties) inspectorProperties$: Observable<InspectorProperties>;

  colorPresets: string[] = [
    '#4f46e5', // Indigo
    '#0284c7', // Sky
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Rose
    '#8b5cf6', // Violet
    '#0f172a', // Slate
    '#ffffff'  // White
  ];

  fontFamilies: string[] = [
    'Helvetica',
    'Times New Roman',
    'Courier'
  ];

  constructor(private store: Store) {}

  onColorChange(color: string) {
    this.store.dispatch(new UpdateInspectorProperties({ color }));
  }

  onStrokeChange(strokeWidth: number) {
    this.store.dispatch(new UpdateInspectorProperties({ strokeWidth }));
  }

  onFontSizeChange(fontSize: number) {
    this.store.dispatch(new UpdateInspectorProperties({ fontSize }));
  }

  onFontFamilyChange(fontFamily: string) {
    this.store.dispatch(new UpdateInspectorProperties({ fontFamily }));
  }

  onOpacityChange(opacity: number) {
    this.store.dispatch(new UpdateInspectorProperties({ opacity }));
  }

  onWatermarkTextChange(watermarkText: string) {
    this.store.dispatch(new UpdateInspectorProperties({ watermarkText }));
  }

  onWatermarkAngleChange(watermarkAngle: number) {
    this.store.dispatch(new UpdateInspectorProperties({ watermarkAngle }));
  }

  onDeleteSelected() {
    const selected = this.store.selectSnapshot(StudioState.getSelectedAnnotation);
    if (selected) {
      this.store.dispatch(new DeleteAnnotation(selected.id));
    }
  }

  onDeselect() {
    this.store.dispatch(new SelectAnnotation(null));
  }
}
