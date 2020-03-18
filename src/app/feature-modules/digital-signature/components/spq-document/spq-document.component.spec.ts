import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpqDocumentComponent } from './spq-document.component';

describe('SpqDocumentComponent', () => {
  let component: SpqDocumentComponent;
  let fixture: ComponentFixture<SpqDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpqDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpqDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
