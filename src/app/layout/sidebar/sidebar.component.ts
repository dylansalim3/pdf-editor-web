import { Component, EventEmitter, Input, Output } from '@angular/core';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
  badgeColor?: string;
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
      title: 'Workspace',
      items: [
        { label: 'Dashboard', icon: 'dashboard', route: '/' },
        { label: 'Studio Editor', icon: 'file-pdf', route: '/pdf-rotate/editor', badge: 'PRO', badgeColor: 'indigo' },
        { label: 'Upload PDF', icon: 'cloud-upload', route: '/upload' },
        { label: 'Bulk Queue', icon: 'folder-open', route: '/stitch/bulk' },
      ]
    },
    {
      title: 'Page Suite',
      items: [
        { label: 'Rotate Pages', icon: 'rotate-right', route: '/tools/rotate' },
        { label: 'Delete Pages', icon: 'delete', route: '/tools/delete' },
        { label: 'Reorder Pages', icon: 'swap', route: '/tools/reorder' },
        { label: 'Extract Pages', icon: 'export', route: '/tools/extract' },
        { label: 'Insert Pages', icon: 'file-add', route: '/tools/insert' },
      ]
    },
    {
      title: 'Operations',
      items: [
        { label: 'Merge PDFs', icon: 'merge-cells', route: '/tools/merge', badge: 'POPULAR' },
        { label: 'Split PDF', icon: 'scissor', route: '/tools/split' },
        { label: 'Compress PDF', icon: 'compress', route: '/tools/compress' },
        { label: 'Protect & Lock', icon: 'lock', route: '/tools/protect' },
        { label: 'Add Watermark', icon: 'copyright', route: '/tools/watermark' },
        { label: 'Sign & Annotate', icon: 'form', route: '/tools/sign' },
      ]
    },
    {
      title: 'Conversion Suite',
      items: [
        { label: 'Word to PDF', icon: 'file-word', route: '/convert/word-to-pdf' },
        { label: 'PDF to Word', icon: 'file-text', route: '/convert/pdf-to-word' },
        { label: 'PDF to Text', icon: 'file-search', route: '/convert/pdf-to-text', badge: 'OCR' },
        { label: 'Image to PDF', icon: 'file-image', route: '/convert/image-to-pdf' },
        { label: 'PDF to Image', icon: 'picture', route: '/convert/pdf-to-image' },
      ]
    },
  ];

  onToggle(): void {
    this.toggle.emit();
  }
}

