import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferInformationComponent } from './offer-information.component';

describe('OfferInformationComponent', () => {
  let component: OfferInformationComponent;
  let fixture: ComponentFixture<OfferInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
