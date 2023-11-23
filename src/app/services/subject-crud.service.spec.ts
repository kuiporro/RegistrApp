import { TestBed } from '@angular/core/testing';

import { SubjectCrudService } from './subject-crud.service';

describe('SubjectCrudService', () => {
  let service: SubjectCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
