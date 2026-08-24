import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { SignRoutingModule } from './sign-routing.module';
import { SignComponent } from './sign.component';

@NgModule({
  declarations: [
    SignComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SignRoutingModule,
    NzUploadModule,
    NzIconModule,
    NzButtonModule,
    NzMessageModule,
    NzRadioModule,
    NzInputNumberModule,
    NzTabsModule,
    NzSelectModule
  ]
})
export class SignModule { }

