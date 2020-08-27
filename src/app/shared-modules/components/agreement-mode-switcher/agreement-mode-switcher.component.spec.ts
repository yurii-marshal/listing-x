import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementModeSwitcherComponent } from './agreement-mode-switcher.component';

describe('AgreementModeSwitcherComponent', () => {
  let component: AgreementModeSwitcherComponent;
  let fixture: ComponentFixture<AgreementModeSwitcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgreementModeSwitcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementModeSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
