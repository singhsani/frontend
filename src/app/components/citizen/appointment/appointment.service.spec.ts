import { TestBed, inject } from '@angular/core/testing';

import { AppointmentServices } from './appointment.service';

describe('AppointmentServices', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppointmentServices]
    });
  });

  it('should be created', inject([AppointmentServices], (service: AppointmentServices) => {
    expect(service).toBeTruthy();
  }));
});
