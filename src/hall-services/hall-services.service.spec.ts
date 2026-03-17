import { Test, TestingModule } from '@nestjs/testing';
import { HallServicesService } from './hall-services.service';

describe('HallServicesService', () => {
  let service: HallServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HallServicesService],
    }).compile();

    service = module.get<HallServicesService>(HallServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
