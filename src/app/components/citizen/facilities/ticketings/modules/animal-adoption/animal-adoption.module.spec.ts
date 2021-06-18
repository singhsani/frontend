import { AnimalAdoptionModule } from './animal-adoption.module';

describe('AnimalAdoptionModule', () => {
  let animalAdoptionModule: AnimalAdoptionModule;

  beforeEach(() => {
    animalAdoptionModule = new AnimalAdoptionModule();
  });

  it('should create an instance', () => {
    expect(animalAdoptionModule).toBeTruthy();
  });
});
