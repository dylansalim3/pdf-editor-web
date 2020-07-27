import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzResizeEvent} from 'ng-zorro-antd/resizable';
import {Select} from '@ngxs/store';
import {PdfRotateState} from '../../state/pdf-rotate.state';
import {Observable} from 'rxjs';
import {PagesLoadedEvent} from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-pdf-rotate-editor',
  templateUrl: './pdf-rotate-editor.component.html',
  styleUrls: ['./pdf-rotate-editor.component.less']
})
export class PdfRotateEditorComponent implements OnInit {

  src: any;
  col = 8;
  id = -1;
  startPage = 1;
  endPage = 1;
  maxPage = 0;

  watermarkText: string;
  colorCode = '#eeeeee';


  @Select(PdfRotateState.getBlobFile) blobFile$: Observable<any>;

  constructor(router: Router) {
  }

  ngOnInit(): void {
    this.blobFile$.subscribe(file => {
      this.src = file;
      const blob = new Blob([this.src]);
      // blob.
    });
  }


  onResize({col}: NzResizeEvent): void {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.col = col!;
    });
  }

  onPageLoaded({pagesCount}: PagesLoadedEvent) {
    this.maxPage = pagesCount;
  }

}
