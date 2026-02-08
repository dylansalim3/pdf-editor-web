import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppShellComponent } from './app-shell/app-shell.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [
    AppShellComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NzIconModule
  ],
  exports: [
    AppShellComponent,
    SidebarComponent
  ]
})
export class LayoutModule { }
