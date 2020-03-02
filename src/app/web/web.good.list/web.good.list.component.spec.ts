import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Web.Good.ListComponent } from './web.good.list.component';

describe('Web.Good.ListComponent', () => {
  let component: Web.Good.ListComponent;
  let fixture: ComponentFixture<Web.Good.ListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Web.Good.ListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Web.Good.ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
