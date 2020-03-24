import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderToolbarComponent } from './order-toolbar.component';

describe('OrderToolbarComponent', () => {
  let component: OrderToolbarComponent;
  let fixture: ComponentFixture<OrderToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
