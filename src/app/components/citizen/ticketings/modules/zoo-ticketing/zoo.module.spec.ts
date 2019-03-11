import { ZooTicketingModule } from './zoo-ticketing.module';

describe('ZooTicketingModule', () => {
  let ZooTicketingModule: ZooTicketingModule;

  beforeEach(() => {
    ZooTicketingModule = new ZooTicketingModule();
  });

  it('should create an instance', () => {
    expect(ZooTicketingModule).toBeTruthy();
  });
});
