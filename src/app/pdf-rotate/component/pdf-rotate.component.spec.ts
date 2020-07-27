import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfRotateComponent } from './pdf-rotate.component';

describe('PdfRotateComponent', () => {
  let component: PdfRotateComponent;
  let fixture: ComponentFixture<PdfRotateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfRotateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfRotateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
