import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleCOComponent } from './multiple-co.component';

describe('MultipleCOComponent', () => {
  let component: MultipleCOComponent;
  let fixture: ComponentFixture<MultipleCOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleCOComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleCOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
