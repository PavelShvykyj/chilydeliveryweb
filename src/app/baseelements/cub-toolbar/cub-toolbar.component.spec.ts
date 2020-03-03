import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CubToolbarComponent } from './cub-toolbar.component';

describe('CubToolbarComponent', () => {
  let component: CubToolbarComponent;
  let fixture: ComponentFixture<CubToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CubToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CubToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
