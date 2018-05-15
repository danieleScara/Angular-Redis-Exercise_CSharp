import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectHtml5Component } from './select-html5.component';

describe('SelectHtml5Component', () => {
  let component: SelectHtml5Component;
  let fixture: ComponentFixture<SelectHtml5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectHtml5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectHtml5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
