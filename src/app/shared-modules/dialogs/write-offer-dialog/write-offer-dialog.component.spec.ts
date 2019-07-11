import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteOfferDialogComponent } from './write-offer-dialog.component';

describe('WriteOfferDialogComponent', () => {
  let component: WriteOfferDialogComponent;
  let fixture: ComponentFixture<WriteOfferDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteOfferDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteOfferDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
