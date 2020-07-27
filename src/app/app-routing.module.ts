import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/pdf-rotate' },
  { path: 'pdf-rotate', loadChildren: () => import('./pdf-rotate/pdf-rotate.module').then(m => m.PdfRotateModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
