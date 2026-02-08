import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { StitchState } from '../../store/stitch.state';
import { StitchFile } from '../../models/stitch.model';
import { SelectFile } from '../../store/stitch.actions';

@Component({
  selector: 'app-editor-workspace',
  templateUrl: './editor-workspace.component.html',
  styleUrls: ['./editor-workspace.component.css']
})
export class EditorWorkspaceComponent implements OnInit {

  @Select(StitchState.getSelectedFile) selectedFile$!: Observable<StitchFile | undefined>;
  @Select(StitchState.getFiles) files$!: Observable<StitchFile[]>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.files$.subscribe((files) => {
      const selectedFile = this.store.selectSnapshot(StitchState.getSelectedFile);
      if (!selectedFile && files.length) {
        this.store.dispatch(new SelectFile(files[0].id));
      }
    });
  }

}
