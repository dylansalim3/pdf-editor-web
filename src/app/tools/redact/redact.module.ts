import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RedactRoutingModule } from './redact-routing.module';
import { RedactComponent } from './redact.component';


@NgModule({
  declarations: [
    RedactComponent
  ],
  imports: [
    CommonModule,
    RedactRoutingModule
  ]
})
export class RedactModule { }
