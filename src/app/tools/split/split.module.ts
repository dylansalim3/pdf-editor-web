import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SplitComponent } from './split.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

const routes: Routes = [
  {
    path: '',
    component: SplitComponent
  }
];

@NgModule({
  declarations: [SplitComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NzIconModule,
    NzButtonModule,
    NzUploadModule,
    NzProgressModule,
    NzRadioModule,
    NzInputNumberModule
  ]
})
export class SplitModule { }
