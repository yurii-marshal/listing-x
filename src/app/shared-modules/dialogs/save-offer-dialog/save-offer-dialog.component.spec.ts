import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveOfferDialogComponent } from './save-offer-dialog.component';

describe('SaveOfferDialogComponent', () => {
  let component: SaveOfferDialogComponent;
  let fixture: ComponentFixture<SaveOfferDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveOfferDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveOfferDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
