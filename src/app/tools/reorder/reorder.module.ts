import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { ReorderRoutingModule } from './reorder-routing.module';
import { ReorderComponent } from './reorder.component';

@NgModule({
  declarations: [
    ReorderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReorderRoutingModule,
    NzUploadModule,
    NzIconModule,
    NzButtonModule,
    NzMessageModule,
    NzSpinModule
  ]
})
export class ReorderModule { }
