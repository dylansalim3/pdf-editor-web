import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OcrRoutingModule } from './ocr-routing.module';
import { OcrComponent } from './ocr.component';


@NgModule({
  declarations: [
    OcrComponent
  ],
  imports: [
    CommonModule,
    OcrRoutingModule
  ]
})
export class OcrModule { }
