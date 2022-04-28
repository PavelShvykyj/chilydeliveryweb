import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoicegoodsComponent } from './choicegoods.component';

describe('ChoicegoodsComponent', () => {
  let component: ChoicegoodsComponent;
  let fixture: ComponentFixture<ChoicegoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoicegoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoicegoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
