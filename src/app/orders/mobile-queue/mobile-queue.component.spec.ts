import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileQueueComponent } from './mobile-queue.component';

describe('MobileQueueComponent', () => {
  let component: MobileQueueComponent;
  let fixture: ComponentFixture<MobileQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
