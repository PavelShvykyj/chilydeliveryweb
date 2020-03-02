import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersExchangeComponent } from './orders-exchange.component';

describe('OrdersExchangeComponent', () => {
  let component: OrdersExchangeComponent;
  let fixture: ComponentFixture<OrdersExchangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersExchangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
