import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebGoodEditComponent } from './web-good-edit.component';

describe('WebGoodEditComponent', () => {
  let component: WebGoodEditComponent;
  let fixture: ComponentFixture<WebGoodEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebGoodEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebGoodEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
