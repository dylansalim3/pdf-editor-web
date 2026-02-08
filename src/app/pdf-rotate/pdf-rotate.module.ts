import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {PdfRotateComponent} from './component/pdf-rotate.component';
import {PdfRotateRoutingModule} from './pdf-rotate-routing.module';
import {NzUploadModule} from 'ng-zorro-antd/upload';
import {NzSpaceModule} from 'ng-zorro-antd/space';
import {NzMessageModule} from 'ng-zorro-antd/message';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzSelectModule} from 'ng-zorro-antd/select';
// import {NzColorPickerModule} from 'ng-zorro-antd/color-picker'; // Not available in v12
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzTypographyModule} from 'ng-zorro-antd/typography';
import {NzGridModule} from 'ng-zorro-antd/grid';
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
    NzUploadModule,
    NzSpaceModule,
    NzMessageModule,
    NzModalModule,
    NzButtonModule,
    NzInputModule,
    NzInputNumberModule,
    NzCheckboxModule,
    NzSelectModule,
    NzSpinModule,
    NzIconModule,
    NzTypographyModule,
    NzGridModule,
    NgxExtendedPdfViewerModule,
    CommonModule,
    NzResizableModule,
    NgxsModule.forFeature([PdfRotateState]),
    FormsModule,
  ],
  declarations: [
    PdfRotateComponent,
    UrlSanitizerPipe,
    PdfRotateEditorComponent,
  ],

})
export class PdfRotateModule {

}
