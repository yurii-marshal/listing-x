import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddendumSignatureComponent } from './addendum-signature.component';

describe('AddendumSignatureComponent', () => {
  let component: AddendumSignatureComponent;
  let fixture: ComponentFixture<AddendumSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddendumSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddendumSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
