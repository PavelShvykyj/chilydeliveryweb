import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YndialogComponent } from './yndialog.component';

describe('YndialogComponent', () => {
  let component: YndialogComponent;
  let fixture: ComponentFixture<YndialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YndialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YndialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
