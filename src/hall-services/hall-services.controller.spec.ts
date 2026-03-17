import { Test, TestingModule } from '@nestjs/testing';
import { HallServicesController } from './hall-services.controller';

describe('HallServicesController', () => {
  let controller: HallServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HallServicesController],
    }).compile();

    controller = module.get<HallServicesController>(HallServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
