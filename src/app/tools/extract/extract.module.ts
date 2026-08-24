import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

import { ExtractRoutingModule } from './extract-routing.module';
import { ExtractComponent } from './extract.component';

@NgModule({
  declarations: [
    ExtractComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ExtractRoutingModule,
    NzUploadModule,
    NzIconModule,
    NzButtonModule,
    NzMessageModule,
    NzSpinModule,
    NzRadioModule,
    NzInputNumberModule
  ]
})
export class ExtractModule { }

