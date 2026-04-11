import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnnotateRoutingModule } from './annotate-routing.module';
import { AnnotateComponent } from './annotate.component';


@NgModule({
  declarations: [
    AnnotateComponent
  ],
  imports: [
    CommonModule,
    AnnotateRoutingModule
  ]
})
export class AnnotateModule { }
