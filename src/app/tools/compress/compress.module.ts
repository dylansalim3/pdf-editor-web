import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CompressComponent } from './compress.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzRadioModule } from 'ng-zorro-antd/radio';

const routes: Routes = [
  {
    path: '',
    component: CompressComponent
  }
];

@NgModule({
  declarations: [CompressComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NzIconModule,
    NzButtonModule,
    NzUploadModule,
    NzProgressModule,
    NzCheckboxModule,
    NzMessageModule,
    NzRadioModule
  ]
})
export class CompressModule { }

