import { SharedTicketingModule } from './shared-ticketing.module';

describe('SharedTicketingModule', () => {
  let sharedTicketingModule: SharedTicketingModule;

  beforeEach(() => {
    sharedTicketingModule = new SharedTicketingModule();
  });

  it('should create an instance', () => {
    expect(sharedTicketingModule).toBeTruthy();
  });
});
