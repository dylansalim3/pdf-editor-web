import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppShellComponent } from './layout/app-shell/app-shell.component';

const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: '', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'upload', loadChildren: () => import('./pdf-rotate/pdf-rotate.module').then(m => m.PdfRotateModule) },
      { 
        path: 'tools', 
        children: [
          // Page Management Tools
          { path: 'rotate', loadChildren: () => import('./tools/rotate/rotate.module').then(m => m.RotateModule) },
          { path: 'delete', loadChildren: () => import('./tools/delete/delete.module').then(m => m.DeleteModule) },
          { path: 'reorder', loadChildren: () => import('./pdf-rotate/pdf-rotate.module').then(m => m.PdfRotateModule) },
          { path: 'extract', loadChildren: () => import('./pdf-rotate/pdf-rotate.module').then(m => m.PdfRotateModule) },
          { path: 'watermark', loadChildren: () => import('./pdf-rotate/pdf-rotate.module').then(m => m.PdfRotateModule) },
          { path: 'merge', loadChildren: () => import('./pdf-rotate/pdf-rotate.module').then(m => m.PdfRotateModule) },
          { path: 'split', loadChildren: () => import('./tools/split/split.module').then(m => m.SplitModule) },
          { path: 'compress', loadChildren: () => import('./tools/compress/compress.module').then(m => m.CompressModule) },
          { path: 'protect', loadChildren: () => import('./tools/protect/protect.module').then(m => m.ProtectModule) },
          { path: 'sign', loadChildren: () => import('./pdf-rotate/pdf-rotate.module').then(m => m.PdfRotateModule) },
          { path: 'annotate', loadChildren: () => import('./pdf-rotate/pdf-rotate.module').then(m => m.PdfRotateModule) },
        ]
      },
      {
        path: 'convert',
        children: [
          { path: 'word-to-pdf', loadChildren: () => import('./convert/word-to-pdf/word-to-pdf.module').then(m => m.WordToPdfModule) },
          { path: 'pdf-to-word', loadChildren: () => import('./convert/pdf-to-word/pdf-to-word.module').then(m => m.PdfToWordModule) },
          { path: 'pdf-to-text', loadChildren: () => import('./convert/pdf-to-text/pdf-to-text.module').then(m => m.PdfToTextModule) },
        ]
      },
      // Legacy route support
      { path: 'pdf-rotate', loadChildren: () => import('./pdf-rotate/pdf-rotate.module').then(m => m.PdfRotateModule) }
    ]
  },
  { path: 'stitch', loadChildren: () => import('./stitch/stitch.module').then(m => m.StitchModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
