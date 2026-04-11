import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedactComponent } from './redact.component';

describe('RedactComponent', () => {
  let component: RedactComponent;
  let fixture: ComponentFixture<RedactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
