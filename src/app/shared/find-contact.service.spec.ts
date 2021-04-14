import { TestBed } from '@angular/core/testing';

import { ManageContactsService } from './manage-contacts.service';

describe('FindContactService', () => {
  let service: ManageContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageContactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
