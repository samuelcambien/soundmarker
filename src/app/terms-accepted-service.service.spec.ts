import { TestBed, inject } from '@angular/core/testing';

import { TermsAcceptedServiceService } from './terms-accepted-service.service';

describe('TermsAcceptedServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TermsAcceptedServiceService]
    });
  });

  it('should be created', inject([TermsAcceptedServiceService], (service: TermsAcceptedServiceService) => {
    expect(service).toBeTruthy();
  }));
});
