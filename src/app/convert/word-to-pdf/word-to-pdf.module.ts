import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WordToPdfComponent } from './word-to-pdf.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpinModule } from 'ng-zorro-antd/spin';

const routes: Routes = [
  {
    path: '',
    component: WordToPdfComponent
  }
];

@NgModule({
  declarations: [WordToPdfComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NzIconModule,
    NzButtonModule,
    NzUploadModule,
    NzProgressModule,
    NzSelectModule,
    NzCheckboxModule,
    NzSpinModule
  ]
})
export class WordToPdfModule { }
