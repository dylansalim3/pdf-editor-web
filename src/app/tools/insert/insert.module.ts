import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsertRoutingModule } from './insert-routing.module';
import { InsertComponent } from './insert.component';


@NgModule({
  declarations: [
    InsertComponent
  ],
  imports: [
    CommonModule,
    InsertRoutingModule
  ]
})
export class InsertModule { }
