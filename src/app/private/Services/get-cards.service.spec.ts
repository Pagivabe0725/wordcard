import { TestBed } from '@angular/core/testing';

import { GetCardsService } from './get-cards.service';

describe('GetCardsService', () => {
  let service: GetCardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetCardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
