import { SharedBookingModule } from './shared-booking.module';

describe('SharedBookingModule', () => {
  let sharedBookingModule: SharedBookingModule;

  beforeEach(() => {
    sharedBookingModule = new SharedBookingModule();
  });

  it('should create an instance', () => {
    expect(sharedBookingModule).toBeTruthy();
  });
});
