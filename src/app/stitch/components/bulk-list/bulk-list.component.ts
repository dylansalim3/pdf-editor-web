import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StitchState } from '../../store/stitch.state';
import { StitchFile } from '../../models/stitch.model';
import { RemoveFile, ToggleFileSelection, SelectAllFiles, ClearFiles, AddFile, SelectFile } from '../../store/stitch.actions';

@Component({
  selector: 'app-bulk-list',
  templateUrl: './bulk-list.component.html',
  styleUrls: ['./bulk-list.component.css']
})
export class BulkListComponent implements OnInit {

  @Select(StitchState.getFiles) files$!: Observable<StitchFile[]>;

  allSelected = false;

  constructor(private store: Store, private router: Router) { }

  ngOnInit(): void {
    this.files$.subscribe((files) => {
      this.allSelected = files.length > 0 && files.every(file => file.selected);
    });
  }

  toggleSelection(id: string) {
    this.store.dispatch(new ToggleFileSelection(id));
  }

  toggleSelectAll() {
    this.allSelected = !this.allSelected;
    this.store.dispatch(new SelectAllFiles(this.allSelected));
  }

  deleteFile(id: string) {
    this.store.dispatch(new RemoveFile(id));
  }

  deleteAll() {
    this.store.dispatch(new ClearFiles());
  }

  triggerFileInput() {
    const fileInput = document.getElementById('bulkFileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    files.forEach((file) => this.addFileFromInput(file));
    input.value = '';
  }

  addFileFromInput(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const newFile: StitchFile = {
        id: this.generateId(),
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        data: reader.result as string,
        status: 'Ready',
        selected: false
      };
      this.store.dispatch(new AddFile(newFile));
    };
    reader.readAsDataURL(file);
  }

  openInEditor(file: StitchFile) {
    this.store.dispatch(new SelectFile(file.id)).subscribe(() => {
      this.router.navigate(['/stitch/editor']);
    });
  }

  formatSize(bytes: number): string {
    if (bytes === 0) {
      return '0 B';
    }
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private generateId(): string {
    const timePart = Date.now().toString(16);
    const randomPart = Math.random().toString(16).slice(2);
    return `${timePart}-${randomPart}`.slice(0, 36);
  }
}
