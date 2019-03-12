import { ZooTicketingModule } from './zoo-ticketing.module';

describe('ZooTicketingModule', () => {
  let zooTicketingModule: ZooTicketingModule;

  beforeEach(() => {
    zooTicketingModule = new ZooTicketingModule();
  });

  it('should create an instance', () => {
    expect(zooTicketingModule).toBeTruthy();
  });
});
