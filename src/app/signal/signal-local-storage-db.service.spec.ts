import { TestBed } from '@angular/core/testing';

import { SignalLocalStorageDbService } from './signal-local-storage-db.service';

describe('SignalLocalStorageDbService', () => {
  let service: SignalLocalStorageDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalLocalStorageDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
