import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddendumDialogComponent } from './addendum-dialog.component';

describe('AddendumDialogComponent', () => {
  let component: AddendumDialogComponent;
  let fixture: ComponentFixture<AddendumDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddendumDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddendumDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
