import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRadioModule } from 'ng-zorro-antd/radio';

import { PdfToImageRoutingModule } from './pdf-to-image-routing.module';
import { PdfToImageComponent } from './pdf-to-image.component';

@NgModule({
  declarations: [
    PdfToImageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PdfToImageRoutingModule,
    NzUploadModule,
    NzIconModule,
    NzButtonModule,
    NzSelectModule,
    NzMessageModule,
    NzProgressModule,
    NzRadioModule
  ]
})
export class PdfToImageModule { }

