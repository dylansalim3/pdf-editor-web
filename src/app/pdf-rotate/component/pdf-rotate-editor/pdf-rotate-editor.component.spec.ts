import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfRotateEditorComponent } from './pdf-rotate-editor.component';

describe('PdfRotateEditorComponent', () => {
  let component: PdfRotateEditorComponent;
  let fixture: ComponentFixture<PdfRotateEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfRotateEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfRotateEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
