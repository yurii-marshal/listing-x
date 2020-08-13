import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerCOAgreementComponent } from './buyer-co-agreement.component';

describe('BuyerCOAgreementComponent', () => {
  let component: BuyerCOAgreementComponent;
  let fixture: ComponentFixture<BuyerCOAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerCOAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerCOAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
