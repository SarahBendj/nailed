import { Test, TestingModule } from '@nestjs/testing';
import { AvailibilityService } from './availibility.service';

describe('AvailibilityService', () => {
  let service: AvailibilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvailibilityService],
    }).compile();

    service = module.get<AvailibilityService>(AvailibilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
