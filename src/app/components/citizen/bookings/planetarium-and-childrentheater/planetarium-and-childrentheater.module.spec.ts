import { PlanetariumAndChildrentheaterModule } from './planetarium-and-childrentheater.module';

describe('PlanetariumAndChildrentheaterModule', () => {
  let planetariumAndChildrentheaterModule: PlanetariumAndChildrentheaterModule;

  beforeEach(() => {
    planetariumAndChildrentheaterModule = new PlanetariumAndChildrentheaterModule();
  });

  it('should create an instance', () => {
    expect(planetariumAndChildrentheaterModule).toBeTruthy();
  });
});
