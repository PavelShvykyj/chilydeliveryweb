import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Onec.Goods.ListComponent } from './onec.goods.list.component';

describe('Onec.Goods.ListComponent', () => {
  let component: Onec.Goods.ListComponent;
  let fixture: ComponentFixture<Onec.Goods.ListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Onec.Goods.ListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Onec.Goods.ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
