import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BatesRoutingModule } from './bates-routing.module';
import { BatesComponent } from './bates.component';


@NgModule({
  declarations: [
    BatesComponent
  ],
  imports: [
    CommonModule,
    BatesRoutingModule
  ]
})
export class BatesModule { }
