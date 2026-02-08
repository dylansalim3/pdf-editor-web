import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { StitchRoutingModule } from './stitch-routing.module';
import { StitchComponent } from './stitch.component';
import { LandingComponent } from './components/landing/landing.component';
import { BulkListComponent } from './components/bulk-list/bulk-list.component';
import { EditorWorkspaceComponent } from './components/editor-workspace/editor-workspace.component';
import { StitchState } from './store/stitch.state';


@NgModule({
  declarations: [
    StitchComponent,
    LandingComponent,
    BulkListComponent,
    EditorWorkspaceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    StitchRoutingModule,
    NgxsModule.forFeature([StitchState]),
    NgxExtendedPdfViewerModule
  ]
})
export class StitchModule { }
