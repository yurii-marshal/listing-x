import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterOfferInformationComponent } from './offer-information.component';

describe('OfferInformationComponent', () => {
  let component: CounterOfferInformationComponent;
  let fixture: ComponentFixture<CounterOfferInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterOfferInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterOfferInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
