import { ChildrenTheaterModule } from './children-theater.module';

describe('ChildrenTheaterModule', () => {
  let childrenTheaterModule: ChildrenTheaterModule;

  beforeEach(() => {
    childrenTheaterModule = new ChildrenTheaterModule();
  });

  it('should create an instance', () => {
    expect(childrenTheaterModule).toBeTruthy();
  });
});
