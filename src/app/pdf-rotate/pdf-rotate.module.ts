import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {PdfRotateComponent} from './component/pdf-rotate.component';
import {PdfRotateRoutingModule} from './pdf-rotate-routing.module';
import {NgZorroAntdModule, NzMessageComponent} from 'ng-zorro-antd';
import {NzSpaceModule} from 'ng-zorro-antd/space';
import {UrlSanitizerPipe} from '../service/UrlSanitizerPipe';
import {NgxExtendedPdfViewerModule} from 'ngx-extended-pdf-viewer';
import {CommonModule} from '@angular/common';
import {PdfRotateEditorComponent} from './component/pdf-rotate-editor/pdf-rotate-editor.component';
import {NzResizableModule} from 'ng-zorro-antd/resizable';
import {NgxsModule} from '@ngxs/store';
import {PdfRotateState} from './state/pdf-rotate.state';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    RouterModule,
    PdfRotateRoutingModule,
    NgZorroAntdModule,
    NzSpaceModule,
    NgxExtendedPdfViewerModule,
    CommonModule,
    NzResizableModule,
    NgxsModule.forRoot([PdfRotateState]),
    FormsModule,
  ],
  declarations: [
    PdfRotateComponent,
    UrlSanitizerPipe,
    PdfRotateEditorComponent,
  ],
  providers: [NzMessageComponent],

})
export class PdfRotateModule {

}
