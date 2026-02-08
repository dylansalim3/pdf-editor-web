import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { AddFile } from '../../store/stitch.actions';
import { StitchFile } from '../../models/stitch.model';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private store: Store, private router: Router) { }

  ngOnInit(): void {
  }

  toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    if (!files.length) {
      return;
    }
    Promise.all(files.map(file => this.processFile(file))).then(() => {
      this.router.navigate(['/stitch/bulk']);
    });
    input.value = '';
  }

  processFile(file: File): Promise<void> {
    return new Promise((resolve) => {
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
        this.store.dispatch(new AddFile(newFile)).subscribe(() => resolve());
      };
      reader.readAsDataURL(file);
    });
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  private generateId(): string {
    const timePart = Date.now().toString(16);
    const randomPart = Math.random().toString(16).slice(2);
    return `${timePart}-${randomPart}`.slice(0, 36);
  }
}
