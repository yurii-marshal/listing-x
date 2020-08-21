import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarControlsComponent } from './sidebar-controls.component';

describe('SidebarControlsComponent', () => {
  let component: SidebarControlsComponent;
  let fixture: ComponentFixture<SidebarControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
