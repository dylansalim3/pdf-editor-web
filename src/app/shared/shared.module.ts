import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolCardComponent } from './components/tool-card/tool-card.component';
import { FileCardComponent } from './components/file-card/file-card.component';



@NgModule({
  declarations: [
    ToolCardComponent,
    FileCardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
