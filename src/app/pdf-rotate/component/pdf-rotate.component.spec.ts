import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PdfRotateComponent } from './pdf-rotate.component';
import { NgxsModule } from '@ngxs/store';
import { PdfRotateState } from '../state/pdf-rotate.state';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PdfRotateComponent', () => {
  let component: PdfRotateComponent;
  let fixture: ComponentFixture<PdfRotateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgxsModule.forRoot([PdfRotateState])
      ],
      declarations: [ PdfRotateComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
