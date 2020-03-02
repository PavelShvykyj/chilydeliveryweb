import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LentaToolbarComponent } from './lenta-toolbar.component';

describe('LentaToolbarComponent', () => {
  let component: LentaToolbarComponent;
  let fixture: ComponentFixture<LentaToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LentaToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LentaToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
