import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxsModule } from '@ngxs/store';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { StudioRoutingModule } from './studio-routing.module';
import { StudioComponent } from './studio.component';
import { StudioHeaderComponent } from './components/studio-header/studio-header.component';
import { PageThumbnailsComponent } from './components/page-thumbnails/page-thumbnails.component';
import { StudioCanvasComponent } from './components/studio-canvas/studio-canvas.component';
import { FloatingToolbarComponent } from './components/floating-toolbar/floating-toolbar.component';
import { PropertyInspectorComponent } from './components/property-inspector/property-inspector.component';
import { OrganizeModalComponent } from './components/organize-modal/organize-modal.component';
import { SignatureModalComponent } from './components/signature-modal/signature-modal.component';
import { ExportModalComponent } from './components/export-modal/export-modal.component';
import { CommandPaletteComponent } from './components/command-palette/command-palette.component';
import { StudioState } from './store/studio.state';

@NgModule({
  declarations: [
    StudioComponent,
    StudioHeaderComponent,
    PageThumbnailsComponent,
    StudioCanvasComponent,
    FloatingToolbarComponent,
    PropertyInspectorComponent,
    OrganizeModalComponent,
    SignatureModalComponent,
    ExportModalComponent,
    CommandPaletteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    NzIconModule,
    NzModalModule,
    NzToolTipModule,
    NzButtonModule,
    NzDropDownModule,
    StudioRoutingModule,
    NgxsModule.forFeature([StudioState])
  ]
})
export class StudioModule {}
