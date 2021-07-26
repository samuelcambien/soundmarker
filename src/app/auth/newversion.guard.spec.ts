import { TestBed, async, inject } from '@angular/core/testing';

import { NewversionGuard } from './newversion.guard';

describe('NewversionGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewversionGuard]
    });
  });

  it('should ...', inject([NewversionGuard], (guard: NewversionGuard) => {
    expect(guard).toBeTruthy();
  }));
});
