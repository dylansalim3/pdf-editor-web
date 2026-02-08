import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorWorkspaceComponent } from './editor-workspace.component';

describe('EditorWorkspaceComponent', () => {
  let component: EditorWorkspaceComponent;
  let fixture: ComponentFixture<EditorWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorWorkspaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
