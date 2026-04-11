import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PdfToImageRoutingModule } from './pdf-to-image-routing.module';
import { PdfToImageComponent } from './pdf-to-image.component';


@NgModule({
  declarations: [
    PdfToImageComponent
  ],
  imports: [
    CommonModule,
    PdfToImageRoutingModule
  ]
})
export class PdfToImageModule { }
