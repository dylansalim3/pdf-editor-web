import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageToPdfRoutingModule } from './image-to-pdf-routing.module';
import { ImageToPdfComponent } from './image-to-pdf.component';


@NgModule({
  declarations: [
    ImageToPdfComponent
  ],
  imports: [
    CommonModule,
    ImageToPdfRoutingModule
  ]
})
export class ImageToPdfModule { }
