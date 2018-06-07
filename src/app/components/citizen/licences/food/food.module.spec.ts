import { FoodModule } from './food.module';

describe('FoodModule', () => {
  let foodModule: FoodModule;

  beforeEach(() => {
    foodModule = new FoodModule();
  });

  it('should create an instance', () => {
    expect(foodModule).toBeTruthy();
  });
});
