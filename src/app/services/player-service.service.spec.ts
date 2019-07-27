import {inject, TestBed} from '@angular/core/testing';

import {Player} from './player.service';

describe('PlayerServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Player]
    });
  });

  it('should be created', inject([Player], (service: Player) => {
    expect(service).toBeTruthy();
  }));
});
