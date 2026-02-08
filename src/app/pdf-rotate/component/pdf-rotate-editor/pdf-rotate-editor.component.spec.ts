import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PdfRotateEditorComponent } from './pdf-rotate-editor.component';
import { NgxsModule, Store } from '@ngxs/store';
import { PdfRotateState } from '../../state/pdf-rotate.state';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';

describe('PdfRotateEditorComponent', () => {
  let component: PdfRotateEditorComponent;
  let fixture: ComponentFixture<PdfRotateEditorComponent>;

  const storeStub = {
    select: () => of(''),
    dispatch: () => of({})
  };

  const modalServiceStub = {
    confirm: () => {},
    info: () => {},
    success: () => {},
    error: () => {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgxsModule.forRoot([PdfRotateState])
      ],
      declarations: [ PdfRotateEditorComponent ],
      providers: [
        { provide: Store, useValue: storeStub },
        { provide: NzModalService, useValue: modalServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
