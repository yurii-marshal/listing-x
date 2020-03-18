import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddendumDocumentComponent } from './addendum-document.component';

describe('AddendumDocumentComponent', () => {
  let component: AddendumDocumentComponent;
  let fixture: ComponentFixture<AddendumDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddendumDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddendumDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
