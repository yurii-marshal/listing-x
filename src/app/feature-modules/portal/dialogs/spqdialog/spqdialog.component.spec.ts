import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SPQDialogComponent } from './spqdialog.component';

describe('SPQDialogComponent', () => {
  let component: SPQDialogComponent;
  let fixture: ComponentFixture<SPQDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SPQDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SPQDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
