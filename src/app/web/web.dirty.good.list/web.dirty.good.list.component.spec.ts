import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Web.Dirty.Good.ListComponent } from './web.dirty.good.list.component';

describe('Web.Dirty.Good.ListComponent', () => {
  let component: Web.Dirty.Good.ListComponent;
  let fixture: ComponentFixture<Web.Dirty.Good.ListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Web.Dirty.Good.ListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Web.Dirty.Good.ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
