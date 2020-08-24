import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterOfferControlsComponent } from './sidebar-controls.component';

describe('SidebarControlsComponent', () => {
  let component: CounterOfferControlsComponent;
  let fixture: ComponentFixture<CounterOfferControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterOfferControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterOfferControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
