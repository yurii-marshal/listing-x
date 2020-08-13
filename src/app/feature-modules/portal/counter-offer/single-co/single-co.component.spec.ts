import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCOComponent } from './single-co.component';

describe('SingleCOComponent', () => {
  let component: SingleCOComponent;
  let fixture: ComponentFixture<SingleCOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleCOComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleCOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
