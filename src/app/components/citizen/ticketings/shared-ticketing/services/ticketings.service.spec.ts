import { TestBed, inject } from '@angular/core/testing';

import { TicketingsService } from './ticketings.service';

describe('TicketingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TicketingsService]
    });
  });

  it('should be created', inject([TicketingsService], (service: TicketingsService) => {
    expect(service).toBeTruthy();
  }));
});
