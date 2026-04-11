import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatesComponent } from './bates.component';

describe('BatesComponent', () => {
  let component: BatesComponent;
  let fixture: ComponentFixture<BatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
