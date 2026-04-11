import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReorderComponent } from './reorder.component';

const routes: Routes = [{ path: '', component: ReorderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReorderRoutingModule { }
