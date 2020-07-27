import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfRotateService {

  file;

  constructor() {
  }

  setBlobFile(file) {
    this.file = file;
  }

  getBlobFile() {
    return this.file;
  }
}
