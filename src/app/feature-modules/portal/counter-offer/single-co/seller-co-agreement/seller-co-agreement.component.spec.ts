import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerCOAgreementComponent } from './seller-co-agreement.component';

describe('SellerCOAgreementComponent', () => {
  let component: SellerCOAgreementComponent;
  let fixture: ComponentFixture<SellerCOAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerCOAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerCOAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
