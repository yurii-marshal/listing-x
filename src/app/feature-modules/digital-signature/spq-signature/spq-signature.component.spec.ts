import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpqSignatureComponent } from './spq-signature.component';

describe('SpqSignatureComponent', () => {
  let component: SpqSignatureComponent;
  let fixture: ComponentFixture<SpqSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpqSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpqSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
