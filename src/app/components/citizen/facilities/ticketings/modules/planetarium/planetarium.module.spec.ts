import { PlanetariumModule } from './planetarium.module';

describe('PlanetariumModule', () => {
  let planetariumModule: PlanetariumModule;

  beforeEach(() => {
    planetariumModule = new PlanetariumModule();
  });

  it('should create an instance', () => {
    expect(planetariumModule).toBeTruthy();
  });
});
