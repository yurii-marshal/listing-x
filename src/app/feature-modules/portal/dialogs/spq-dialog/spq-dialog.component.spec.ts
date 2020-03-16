import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpqDialogComponent } from './spq-dialog.component';

describe('SPQDialogComponent', () => {
  let component: SpqDialogComponent;
  let fixture: ComponentFixture<SpqDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpqDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpqDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
