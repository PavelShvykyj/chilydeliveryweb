import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectparentComponent } from './selectparent.component';

describe('SelectparentComponent', () => {
  let component: SelectparentComponent;
  let fixture: ComponentFixture<SelectparentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectparentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectparentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
