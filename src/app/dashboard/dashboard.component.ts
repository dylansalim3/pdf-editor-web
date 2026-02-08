import { Component, OnInit } from '@angular/core';

interface ToolCategory {
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
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  recentFiles: any[] = [];

  quickActions: Tool[] = [
    {
      id: 'rotate',
      name: 'Rotate Pages',
      description: 'Rotate PDF pages',
      icon: 'rotate-right',
      route: '/tools/rotate',
      color: 'blue'
    },
    {
      id: 'delete',
      name: 'Delete Pages',
      description: 'Remove pages from PDF',
      icon: 'delete',
      route: '/tools/delete',
      color: 'red'
    },
    {
      id: 'watermark',
      name: 'Add Watermark',
      description: 'Add text watermarks',
      icon: 'copyright',
      route: '/tools/watermark',
      color: 'purple'
    },
    {
      id: 'merge',
      name: 'Merge PDFs',
      description: 'Combine multiple PDFs',
      icon: 'merge-cells',
      route: '/tools/merge',
      color: 'green'
    }
  ];

  toolCategories: ToolCategory[] = [
    {
      title: 'Page Management',
      tools: [
        { id: 'rotate', name: 'Rotate Pages', description: 'Rotate left or right', icon: 'rotate-right', route: '/tools/rotate', color: 'blue' },
        { id: 'delete', name: 'Delete Pages', description: 'Remove pages', icon: 'delete', route: '/tools/delete', color: 'red' },
        { id: 'reorder', name: 'Reorder Pages', description: 'Change page order', icon: 'swap', route: '/tools/reorder', color: 'orange' },
        { id: 'extract', name: 'Extract Pages', description: 'Save specific pages', icon: 'file-excel', route: '/tools/extract', color: 'cyan' },
      ]
    },
    {
      title: 'Content Modification',
      tools: [
        { id: 'watermark', name: 'Add Watermark', description: 'Text & image watermarks', icon: 'copyright', route: '/tools/watermark', color: 'purple' },
        { id: 'sign', name: 'Sign PDF', description: 'Digital signatures', icon: 'edit', route: '/tools/sign', color: 'indigo' },
        { id: 'annotate', name: 'Annotate', description: 'Highlight & comment', icon: 'highlight', route: '/tools/annotate', color: 'pink' },
      ]
    },
    {
      title: 'Document Operations',
      tools: [
        { id: 'merge', name: 'Merge PDFs', description: 'Combine files', icon: 'merge-cells', route: '/tools/merge', color: 'green' },
        { id: 'split', name: 'Split PDF', description: 'Divide into parts', icon: 'scissor', route: '/tools/split', color: 'teal' },
        { id: 'compress', name: 'Compress', description: 'Reduce file size', icon: 'compress', route: '/tools/compress', color: 'yellow' },
        { id: 'protect', name: 'Protect', description: 'Password & encryption', icon: 'lock', route: '/tools/protect', color: 'gray' },
      ]
    },
    {
      title: 'Convert',
      tools: [
        { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert DOCX files', icon: 'file-word', route: '/convert/word-to-pdf', color: 'blue' },
        { id: 'pdf-to-word', name: 'PDF to Word', description: 'Convert to DOCX', icon: 'file-text', route: '/convert/pdf-to-word', color: 'blue' },
        { id: 'pdf-to-text', name: 'PDF to Text', description: 'Extract plain text', icon: 'file-text', route: '/convert/pdf-to-text', color: 'gray' },
      ]
    }
  ];

  ngOnInit(): void {
    // Load recent files from localStorage or state
    this.loadRecentFiles();
  }

  private loadRecentFiles(): void {
    // Placeholder for recent files
    this.recentFiles = [];
  }
}
