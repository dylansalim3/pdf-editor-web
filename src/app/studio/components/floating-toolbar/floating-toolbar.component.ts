import { Component, Input } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { StudioTool } from '../../models/studio.model';
import { StudioState } from '../../store/studio.state';
import { SetActiveTool, ToggleSignatureModal } from '../../store/studio.actions';

interface ToolItem {
  id: StudioTool;
  label: string;
  icon: string;
  shortcut?: string;
  badge?: string;
}

@Component({
  selector: 'app-floating-toolbar',
  templateUrl: './floating-toolbar.component.html',
  styleUrls: ['./floating-toolbar.component.css']
})
export class FloatingToolbarComponent {
  @Input() darkMode: boolean = false;

  @Select(StudioState.getActiveTool) activeTool$: Observable<StudioTool>;

  tools: ToolItem[] = [
    { id: 'select', label: 'Select / Move', icon: 'select', shortcut: 'V' },
    { id: 'pan', label: 'Hand Tool / Pan', icon: 'drag', shortcut: 'H' },
    { id: 'text', label: 'Add Text Box', icon: 'font-size', shortcut: 'T' },
    { id: 'draw', label: 'Draw / Pen', icon: 'edit', shortcut: 'P' },
    { id: 'highlight', label: 'Highlighter', icon: 'highlight', shortcut: 'E' },
    { id: 'rectangle', label: 'Rectangle Shape', icon: 'border', shortcut: 'R' },
    { id: 'circle', label: 'Circle Shape', icon: 'radius-setting', shortcut: 'C' },
    { id: 'signature', label: 'Insert Signature', icon: 'form', shortcut: 'S' },
    { id: 'watermark', label: 'Watermark', icon: 'safety-certificate', shortcut: 'W' },
    { id: 'redact', label: 'Redaction Blackout', icon: 'eye-invisible', shortcut: 'X' }
  ];

  constructor(private store: Store) {}

  onSelectTool(tool: StudioTool) {
    if (tool === 'signature') {
      this.store.dispatch(new ToggleSignatureModal(true));
    }
    this.store.dispatch(new SetActiveTool(tool));
  }
}
