import { Component, EventEmitter, Input, Output } from '@angular/core';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
}

interface NavCategory {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();

  navCategories: NavCategory[] = [
    {
      title: 'Main',
      items: [
        { label: 'Dashboard', icon: 'dashboard', route: '/' },
        { label: 'Upload PDF', icon: 'upload', route: '/upload' },
      ]
    },
    {
      title: 'Page Tools',
      items: [
        { label: 'Rotate Pages', icon: 'rotate-right', route: '/tools/rotate' },
        { label: 'Delete Pages', icon: 'delete', route: '/tools/delete' },
        { label: 'Reorder Pages', icon: 'swap', route: '/tools/reorder' },
        { label: 'Extract Pages', icon: 'file-excel', route: '/tools/extract' },
      ]
    },
    {
      title: 'Content Tools',
      items: [
        { label: 'Add Watermark', icon: 'copyright', route: '/tools/watermark' },
        { label: 'Sign PDF', icon: 'edit', route: '/tools/sign' },
        { label: 'Annotate', icon: 'highlight', route: '/tools/annotate' },
      ]
    },
    {
      title: 'Operations',
      items: [
        { label: 'Merge PDFs', icon: 'merge-cells', route: '/tools/merge' },
        { label: 'Split PDF', icon: 'scissor', route: '/tools/split' },
        { label: 'Compress', icon: 'compress', route: '/tools/compress' },
        { label: 'Protect', icon: 'lock', route: '/tools/protect' },
      ]
    },
    {
      title: 'Convert',
      items: [
        { label: 'Word to PDF', icon: 'file-word', route: '/convert/word-to-pdf' },
        { label: 'PDF to Word', icon: 'file-text', route: '/convert/pdf-to-word' },
        { label: 'PDF to Text', icon: 'file-text', route: '/convert/pdf-to-text' },
      ]
    },
  ];

  onToggle(): void {
    this.toggle.emit();
  }
}
