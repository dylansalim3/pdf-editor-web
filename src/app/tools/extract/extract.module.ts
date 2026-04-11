import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExtractRoutingModule } from './extract-routing.module';
import { ExtractComponent } from './extract.component';


@NgModule({
  declarations: [
    ExtractComponent
  ],
  imports: [
    CommonModule,
    ExtractRoutingModule
  ]
})
export class ExtractModule { }
