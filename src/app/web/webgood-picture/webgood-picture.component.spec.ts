import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebgoodPictureComponent } from './webgood-picture.component';

describe('WebgoodPictureComponent', () => {
  let component: WebgoodPictureComponent;
  let fixture: ComponentFixture<WebgoodPictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebgoodPictureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebgoodPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
