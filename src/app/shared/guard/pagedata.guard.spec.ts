import { TestBed } from '@angular/core/testing';

import { PagedataGuard } from './pagedata.guard';

describe('PagedataGuard', () => {
  let guard: PagedataGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PagedataGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
