import { EngineeringModule } from './engineering.module';

describe('EngineeringModule', () => {
  let engineeringModule: EngineeringModule;

  beforeEach(() => {
    engineeringModule = new EngineeringModule();
  });

  it('should create an instance', () => {
    expect(engineeringModule).toBeTruthy();
  });
});
