import { ZooModule } from './zoo.module';

describe('ZooModule', () => {
  let zooModule: ZooModule;

  beforeEach(() => {
    zooModule = new ZooModule();
  });

  it('should create an instance', () => {
    expect(zooModule).toBeTruthy();
  });
});
