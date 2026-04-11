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
          { path: 'reorder', loadChildren: () => import('./tools/reorder/reorder.module').then(m => m.ReorderModule) },
          { path: 'extract', loadChildren: () => import('./tools/extract/extract.module').then(m => m.ExtractModule) },
          { path: 'watermark', loadChildren: () => import('./pdf-rotate/pdf-rotate.module').then(m => m.PdfRotateModule) },
          { path: 'merge', loadChildren: () => import('./tools/merge/merge.module').then(m => m.MergeModule) },
          { path: 'split', loadChildren: () => import('./tools/split/split.module').then(m => m.SplitModule) },
          { path: 'compress', loadChildren: () => import('./tools/compress/compress.module').then(m => m.CompressModule) },
          { path: 'protect', loadChildren: () => import('./tools/protect/protect.module').then(m => m.ProtectModule) },
          { path: 'sign', loadChildren: () => import('./tools/sign/sign.module').then(m => m.SignModule) },
          { path: 'annotate', loadChildren: () => import('./tools/annotate/annotate.module').then(m => m.AnnotateModule) },
          { path: 'insert', loadChildren: () => import('./tools/insert/insert.module').then(m => m.InsertModule) },
          { path: 'ocr', loadChildren: () => import('./tools/ocr/ocr.module').then(m => m.OcrModule) },
          { path: 'compare', loadChildren: () => import('./tools/compare/compare.module').then(m => m.CompareModule) },
          { path: 'redact', loadChildren: () => import('./tools/redact/redact.module').then(m => m.RedactModule) },
          { path: 'form', loadChildren: () => import('./tools/form/form.module').then(m => m.FormModule) },
          { path: 'bates', loadChildren: () => import('./tools/bates/bates.module').then(m => m.BatesModule) },
        ]
      },
      {
        path: 'convert',
        children: [
          { path: 'word-to-pdf', loadChildren: () => import('./convert/word-to-pdf/word-to-pdf.module').then(m => m.WordToPdfModule) },
          { path: 'pdf-to-word', loadChildren: () => import('./convert/pdf-to-word/pdf-to-word.module').then(m => m.PdfToWordModule) },
          { path: 'pdf-to-text', loadChildren: () => import('./convert/pdf-to-text/pdf-to-text.module').then(m => m.PdfToTextModule) },
          { path: 'image-to-pdf', loadChildren: () => import('./convert/image-to-pdf/image-to-pdf.module').then(m => m.ImageToPdfModule) },
          { path: 'pdf-to-image', loadChildren: () => import('./convert/pdf-to-image/pdf-to-image.module').then(m => m.PdfToImageModule) },
        ]
      },
      // Legacy route support
      { path: 'pdf-rotate', loadChildren: () => import('./pdf-rotate/pdf-rotate.module').then(m => m.PdfRotateModule) },
      { path: 'stitch', loadChildren: () => import('./stitch/stitch.module').then(m => m.StitchModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
