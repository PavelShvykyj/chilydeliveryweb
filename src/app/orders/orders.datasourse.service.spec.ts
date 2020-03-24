import { TestBed } from '@angular/core/testing';

import { Orders.DatasourseService } from './orders.datasourse.service';

describe('Orders.DatasourseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Orders.DatasourseService = TestBed.get(Orders.DatasourseService);
    expect(service).toBeTruthy();
  });
});
