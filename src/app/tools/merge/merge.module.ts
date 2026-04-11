import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MergeRoutingModule } from './merge-routing.module';
import { MergeComponent } from './merge.component';


@NgModule({
  declarations: [
    MergeComponent
  ],
  imports: [
    CommonModule,
    MergeRoutingModule
  ]
})
export class MergeModule { }
