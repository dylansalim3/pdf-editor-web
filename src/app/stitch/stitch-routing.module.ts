import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { BulkListComponent } from './components/bulk-list/bulk-list.component';
import { EditorWorkspaceComponent } from './components/editor-workspace/editor-workspace.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'bulk', component: BulkListComponent },
  { path: 'editor', component: EditorWorkspaceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StitchRoutingModule { }
