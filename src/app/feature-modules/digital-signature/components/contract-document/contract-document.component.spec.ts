import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDocumentComponent } from './contract-document.component';

describe('ContractDocumentComponent', () => {
  let component: ContractDocumentComponent;
  let fixture: ComponentFixture<ContractDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
