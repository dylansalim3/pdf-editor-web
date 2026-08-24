import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { StoreBlobFile } from '../pdf-rotate/actions/pdf-rotate.actions';


interface ToolCategory {
  id: string;
  title: string;
  tools: Tool[];
}

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  badge?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  searchQuery = '';
  activeFilter = 'all';

  quickActions: Tool[] = [
    {
      id: 'rotate',
      name: 'Rotate Pages',
      description: 'Rotate single or all PDF pages in any orientation',
      icon: 'rotate-right',
      route: '/tools/rotate',
      color: 'indigo',
      badge: 'POPULAR'
    },
    {
      id: 'delete',
      name: 'Delete Pages',
      description: 'Selectively remove unwanted pages or ranges',
      icon: 'delete',
      route: '/tools/delete',
      color: 'rose'
    },
    {
      id: 'merge',
      name: 'Merge PDFs',
      description: 'Combine multiple PDF files into one clean doc',
      icon: 'merge-cells',
      route: '/tools/merge',
      color: 'emerald',
      badge: 'TOP'
    },
    {
      id: 'watermark',
      name: 'Watermark',
      description: 'Stamp custom diagonal or horizontal text overlay',
      icon: 'copyright',
      route: '/tools/watermark',
      color: 'violet'
    }
  ];

  toolCategories: ToolCategory[] = [
    {
      id: 'pages',
      title: 'Page Suite',
      tools: [
        { id: 'rotate', name: 'Rotate Pages', description: 'Rotate left, right, or 180°', icon: 'rotate-right', route: '/tools/rotate', color: 'indigo', badge: 'TOP' },
        { id: 'delete', name: 'Delete Pages', description: 'Remove single/range pages', icon: 'delete', route: '/tools/delete', color: 'rose' },
        { id: 'reorder', name: 'Reorder Pages', description: 'Drag & rearrange order', icon: 'swap', route: '/tools/reorder', color: 'amber' },
        { id: 'extract', name: 'Extract Pages', description: 'Export specific pages', icon: 'export', route: '/tools/extract', color: 'sky' },
        { id: 'insert', name: 'Insert Pages', description: 'Add new pages into PDF', icon: 'file-add', route: '/tools/insert', color: 'teal' },
      ]
    },
    {
      id: 'operations',
      title: 'Document Operations',
      tools: [
        { id: 'merge', name: 'Merge PDFs', description: 'Combine multiple documents', icon: 'merge-cells', route: '/tools/merge', color: 'emerald', badge: 'HOT' },
        { id: 'split', name: 'Split PDF', description: 'Divide document into parts', icon: 'scissor', route: '/tools/split', color: 'cyan' },
        { id: 'compress', name: 'Compress PDF', description: 'Optimize & reduce file size', icon: 'compress', route: '/tools/compress', color: 'amber' },
        { id: 'protect', name: 'Protect PDF', description: 'Password & secure lock', icon: 'lock', route: '/tools/protect', color: 'purple' },
        { id: 'watermark', name: 'Add Watermark', description: 'Overlay customized text', icon: 'copyright', route: '/tools/watermark', color: 'violet' },
        { id: 'sign', name: 'Sign & Annotate', description: 'Electronic signature & notes', icon: 'form', route: '/tools/sign', color: 'blue' },
      ]
    },
    {
      id: 'convert',
      title: 'Conversion Suite',
      tools: [
        { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert .docx files into PDF', icon: 'file-word', route: '/convert/word-to-pdf', color: 'blue' },
        { id: 'pdf-to-word', name: 'PDF to Word', description: 'Export document to editable DOCX', icon: 'file-text', route: '/convert/pdf-to-word', color: 'indigo' },
        { id: 'pdf-to-text', name: 'PDF to Text', description: 'Extract clean OCR plain text', icon: 'file-search', route: '/convert/pdf-to-text', color: 'slate', badge: 'OCR' },
        { id: 'image-to-pdf', name: 'Image to PDF', description: 'Convert JPG / PNG into PDF', icon: 'file-image', route: '/convert/image-to-pdf', color: 'pink' },
        { id: 'pdf-to-image', name: 'PDF to Image', description: 'Render pages as JPEG / PNG', icon: 'picture', route: '/convert/pdf-to-image', color: 'emerald' },
      ]
    }
  ];

  constructor(
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {}

  setFilter(filterId: string): void {
    this.activeFilter = filterId;
  }

  get filteredCategories(): ToolCategory[] {
    let list = this.toolCategories;
    if (this.activeFilter !== 'all') {
      list = list.filter(c => c.id === this.activeFilter);
    }
    if (!this.searchQuery.trim()) {
      return list;
    }
    const q = this.searchQuery.toLowerCase();
    return list.map(c => ({
      ...c,
      tools: c.tools.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    })).filter(c => c.tools.length > 0);
  }


  async onFileDropped(event: DragEvent): Promise<void> {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
      const reader = new FileReader();
      reader.onload = () => {
        this.store.dispatch(new StoreBlobFile(reader.result as string));
        this.router.navigate(['/pdf-rotate/editor']);
      };
      reader.readAsDataURL(file);
    } else {
      this.router.navigate(['/upload']);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }
}


