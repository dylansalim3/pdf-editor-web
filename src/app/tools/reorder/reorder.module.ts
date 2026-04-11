import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReorderRoutingModule } from './reorder-routing.module';
import { ReorderComponent } from './reorder.component';


@NgModule({
  declarations: [
    ReorderComponent
  ],
  imports: [
    CommonModule,
    ReorderRoutingModule
  ]
})
export class ReorderModule { }
