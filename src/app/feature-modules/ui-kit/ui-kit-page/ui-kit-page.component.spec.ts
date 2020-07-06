import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiKitPageComponent } from './ui-kit-page.component';

describe('UiKitPageComponent', () => {
  let component: UiKitPageComponent;
  let fixture: ComponentFixture<UiKitPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiKitPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiKitPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
