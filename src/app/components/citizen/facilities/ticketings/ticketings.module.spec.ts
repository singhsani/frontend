import { TicketingsModule } from './ticketings.module';

describe('TicketingsModule', () => {
  let ticketingsModule: TicketingsModule;

  beforeEach(() => {
    ticketingsModule = new TicketingsModule();
  });

  it('should create an instance', () => {
    expect(ticketingsModule).toBeTruthy();
  });
});
