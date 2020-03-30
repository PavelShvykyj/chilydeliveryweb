import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogstringinputComponent } from './dialogstringinput.component';

describe('DialogstringinputComponent', () => {
  let component: DialogstringinputComponent;
  let fixture: ComponentFixture<DialogstringinputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogstringinputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogstringinputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
