import { TestBed } from '@angular/core/testing';

import { SignalDirectoryService } from './signal-directory.service';

describe('SignalDirectoryService', () => {
  let service: SignalDirectoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalDirectoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
