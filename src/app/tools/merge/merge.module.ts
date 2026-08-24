import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzMessageModule } from 'ng-zorro-antd/message';

import { MergeRoutingModule } from './merge-routing.module';
import { MergeComponent } from './merge.component';

@NgModule({
  declarations: [
    MergeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MergeRoutingModule,
    NzUploadModule,
    NzIconModule,
    NzButtonModule,
    NzProgressModule,
    NzMessageModule
  ]
})
export class MergeModule { }

