import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NzIconModule,
    NzButtonModule
  ]
})
export class DashboardModule { }

