import { TestBed } from '@angular/core/testing';

import { LocalMessagesService } from './local-messages.service';

describe('LocalMessagesService', () => {
  let service: LocalMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
