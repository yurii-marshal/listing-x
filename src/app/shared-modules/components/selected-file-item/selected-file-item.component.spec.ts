import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedFileItemComponent } from './selected-file-item.component';

describe('SelectedFileItemComponent', () => {
  let component: SelectedFileItemComponent;
  let fixture: ComponentFixture<SelectedFileItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedFileItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedFileItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
