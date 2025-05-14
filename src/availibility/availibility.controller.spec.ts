import { Test, TestingModule } from '@nestjs/testing';
import { AvailibilityController } from './availibility.controller';

describe('AvailibilityController', () => {
  let controller: AvailibilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailibilityController],
    }).compile();

    controller = module.get<AvailibilityController>(AvailibilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
