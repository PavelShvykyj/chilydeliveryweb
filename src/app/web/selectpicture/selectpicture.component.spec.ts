import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectpictureComponent } from './selectpicture.component';

describe('SelectpictureComponent', () => {
  let component: SelectpictureComponent;
  let fixture: ComponentFixture<SelectpictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectpictureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectpictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
