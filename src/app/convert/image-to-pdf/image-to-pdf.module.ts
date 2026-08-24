import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzProgressModule } from 'ng-zorro-antd/progress';

import { ImageToPdfRoutingModule } from './image-to-pdf-routing.module';
import { ImageToPdfComponent } from './image-to-pdf.component';

@NgModule({
  declarations: [
    ImageToPdfComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ImageToPdfRoutingModule,
    NzUploadModule,
    NzIconModule,
    NzButtonModule,
    NzSelectModule,
    NzMessageModule,
    NzProgressModule
  ]
})
export class ImageToPdfModule { }

