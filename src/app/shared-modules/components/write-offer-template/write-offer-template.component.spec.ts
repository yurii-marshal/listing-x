import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteOfferTemplateComponent } from './write-offer-template.component';

describe('WriteOfferTemplateComponent', () => {
  let component: WriteOfferTemplateComponent;
  let fixture: ComponentFixture<WriteOfferTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteOfferTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteOfferTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
