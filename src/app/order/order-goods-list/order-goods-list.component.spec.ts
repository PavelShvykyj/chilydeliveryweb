import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderGoodsListComponent } from './order-goods-list.component';

describe('OrderGoodsListComponent', () => {
  let component: OrderGoodsListComponent;
  let fixture: ComponentFixture<OrderGoodsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderGoodsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderGoodsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
