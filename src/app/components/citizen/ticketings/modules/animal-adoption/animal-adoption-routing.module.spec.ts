import { AnimalAdoptionRoutingModule } from './animal-adoption-routing.module';

describe('AnimalAdoptionRoutingModule', () => {
  let animalAdoptionRoutingModule: AnimalAdoptionRoutingModule;

  beforeEach(() => {
    animalAdoptionRoutingModule = new AnimalAdoptionRoutingModule();
  });

  it('should create an instance', () => {
    expect(animalAdoptionRoutingModule).toBeTruthy();
  });
});
