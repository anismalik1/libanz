import { TestBed, inject } from '@angular/core/testing';

import { Packages.EntitiesService } from './packages.entities.service';

describe('Packages.EntitiesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Packages.EntitiesService]
    });
  });

  it('should be created', inject([Packages.EntitiesService], (service: Packages.EntitiesService) => {
    expect(service).toBeTruthy();
  }));
});
