import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html'
})
export class CompareComponent {
  pdf1Url: SafeResourceUrl | null = null;
  pdf2Url: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  onPdf1(e: any) {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      this.pdf1Url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  onPdf2(e: any) {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      this.pdf2Url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }
}
