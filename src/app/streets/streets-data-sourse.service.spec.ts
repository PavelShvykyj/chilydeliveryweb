import { TestBed } from '@angular/core/testing';

import { StreetsDataSourseService } from './streets-data-sourse.service';

describe('StreetsDataSourseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StreetsDataSourseService = TestBed.get(StreetsDataSourseService);
    expect(service).toBeTruthy();
  });
});
