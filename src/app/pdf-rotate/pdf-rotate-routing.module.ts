import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PdfRotateComponent} from './component/pdf-rotate.component';
import {PdfRotateEditorComponent} from './component/pdf-rotate-editor/pdf-rotate-editor.component';

const routes: Routes = [
  {
    path: '',
    component: PdfRotateComponent
  },
  {
    path: 'editor',
    component: PdfRotateEditorComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class PdfRotateRoutingModule {

}
