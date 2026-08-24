import { Component, HostListener, Input } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { StudioTool } from '../../models/studio.model';
import { StudioState } from '../../store/studio.state';
import { 
  InsertBlankPage, 
  RedoStudioAction, 
  RotateAllPages, 
  RotatePage, 
  SetActivePage, 
  SetActiveTool, 
  SetZoomLevel, 
  ToggleCommandPalette, 
  ToggleExportModal, 
  ToggleOrganizeModal, 
  ToggleSignatureModal, 
  UndoStudioAction 
} from '../../store/studio.actions';

interface CommandAction {
  id: string;
  title: string;
  category: 'Tools' | 'Page' | 'Document' | 'View';
  icon: string;
  shortcut?: string;
  run: () => void;
}

@Component({
  selector: 'app-command-palette',
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.css']
})
export class CommandPaletteComponent {
  @Input() darkMode: boolean = false;

  @Select(StudioState.isCommandPaletteOpen) isOpen$: Observable<boolean>;

  searchQuery: string = '';
  selectedIndex: number = 0;

  commands: CommandAction[] = [
    // Tools
    {
      id: 'tool-text',
      title: 'Add Text Box',
      category: 'Tools',
      icon: 'font-size',
      shortcut: 'T',
      run: () => this.store.dispatch(new SetActiveTool('text'))
    },
    {
      id: 'tool-draw',
      title: 'Freehand Pen / Draw',
      category: 'Tools',
      icon: 'edit',
      shortcut: 'P',
      run: () => this.store.dispatch(new SetActiveTool('draw'))
    },
    {
      id: 'tool-highlight',
      title: 'Highlighter Tool',
      category: 'Tools',
      icon: 'highlight',
      shortcut: 'E',
      run: () => this.store.dispatch(new SetActiveTool('highlight'))
    },
    {
      id: 'tool-signature',
      title: 'Insert Signature / Stamp',
      category: 'Tools',
      icon: 'form',
      shortcut: 'S',
      run: () => {
        this.store.dispatch(new SetActiveTool('signature'));
        this.store.dispatch(new ToggleSignatureModal(true));
      }
    },
    {
      id: 'tool-watermark',
      title: 'Add Watermark',
      category: 'Tools',
      icon: 'safety-certificate',
      shortcut: 'W',
      run: () => this.store.dispatch(new SetActiveTool('watermark'))
    },
    {
      id: 'tool-redact',
      title: 'Redact Blackout Box',
      category: 'Tools',
      icon: 'eye-invisible',
      shortcut: 'X',
      run: () => this.store.dispatch(new SetActiveTool('redact'))
    },

    // Page Actions
    {
      id: 'page-organize',
      title: 'Open Page Organizer Grid',
      category: 'Page',
      icon: 'appstore',
      shortcut: '⌘O',
      run: () => this.store.dispatch(new ToggleOrganizeModal(true))
    },
    {
      id: 'page-rotate-cw',
      title: 'Rotate Active Page 90° Clockwise',
      category: 'Page',
      icon: 'rotate-right',
      shortcut: 'R',
      run: () => {
        const active = this.store.selectSnapshot(StudioState.getActivePageIndex);
        this.store.dispatch(new RotatePage(active, 90));
      }
    },
    {
      id: 'page-rotate-all',
      title: 'Rotate All Pages 90° Clockwise',
      category: 'Page',
      icon: 'redo',
      run: () => this.store.dispatch(new RotateAllPages(90))
    },
    {
      id: 'page-add-blank',
      title: 'Insert Blank Page',
      category: 'Page',
      icon: 'plus',
      run: () => {
        const active = this.store.selectSnapshot(StudioState.getActivePageIndex);
        this.store.dispatch(new InsertBlankPage(active + 1));
      }
    },

    // Document / Export
    {
      id: 'doc-export',
      title: 'Export / Download PDF',
      category: 'Document',
      icon: 'download',
      shortcut: '⌘S',
      run: () => this.store.dispatch(new ToggleExportModal(true))
    },
    {
      id: 'doc-undo',
      title: 'Undo Last Change',
      category: 'Document',
      icon: 'undo',
      shortcut: '⌘Z',
      run: () => this.store.dispatch(new UndoStudioAction())
    },
    {
      id: 'doc-redo',
      title: 'Redo Change',
      category: 'Document',
      icon: 'redo',
      shortcut: '⌘⇧Z',
      run: () => this.store.dispatch(new RedoStudioAction())
    },

    // View
    {
      id: 'view-zoom-in',
      title: 'Zoom In',
      category: 'View',
      icon: 'plus-circle',
      shortcut: '+',
      run: () => {
        const current = this.store.selectSnapshot(StudioState.getZoomLevel);
        this.store.dispatch(new SetZoomLevel(Math.min(current + 20, 300)));
      }
    },
    {
      id: 'view-zoom-out',
      title: 'Zoom Out',
      category: 'View',
      icon: 'minus-circle',
      shortcut: '-',
      run: () => {
        const current = this.store.selectSnapshot(StudioState.getZoomLevel);
        this.store.dispatch(new SetZoomLevel(Math.max(current - 20, 30)));
      }
    },
    {
      id: 'view-zoom-reset',
      title: 'Reset Zoom (100%)',
      category: 'View',
      icon: 'fullscreen-exit',
      shortcut: '0',
      run: () => this.store.dispatch(new SetZoomLevel(100))
    }
  ];

  constructor(private store: Store) {}

  get filteredCommands(): CommandAction[] {
    if (!this.searchQuery) return this.commands;
    const q = this.searchQuery.toLowerCase();
    return this.commands.filter(c => 
      c.title.toLowerCase().includes(q) || 
      c.category.toLowerCase().includes(q)
    );
  }

  onExecute(cmd: CommandAction) {
    cmd.run();
    this.onClose();
  }

  onClose() {
    this.searchQuery = '';
    this.selectedIndex = 0;
    this.store.dispatch(new ToggleCommandPalette(false));
  }

  @HostListener('document:keydown', ['$event'])
  onGlobalKeyDown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      const isOpen = this.store.selectSnapshot(StudioState.isCommandPaletteOpen);
      this.store.dispatch(new ToggleCommandPalette(!isOpen));
      return;
    }

    const isOpen = this.store.selectSnapshot(StudioState.isCommandPaletteOpen);
    if (!isOpen) return;

    if (event.key === 'Escape') {
      this.onClose();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectedIndex = (this.selectedIndex + 1) % this.filteredCommands.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectedIndex = (this.selectedIndex - 1 + this.filteredCommands.length) % this.filteredCommands.length;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const cmd = this.filteredCommands[this.selectedIndex];
      if (cmd) {
        this.onExecute(cmd);
      }
    }
  }
}
