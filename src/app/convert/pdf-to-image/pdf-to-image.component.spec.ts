import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfToImageComponent } from './pdf-to-image.component';

describe('PdfToImageComponent', () => {
  let component: PdfToImageComponent;
  let fixture: ComponentFixture<PdfToImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfToImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfToImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
