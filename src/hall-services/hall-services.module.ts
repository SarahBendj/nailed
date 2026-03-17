import { Module } from '@nestjs/common';
import { HallServicesController } from './hall-services.controller';
import { HallServicesService } from './hall-services.service';


@Module({
  controllers: [HallServicesController],
  providers: [HallServicesService]
})
export class HallServicesModule {}
