import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HallServicesService } from './hall-services.service';
import { Public } from 'src/common/decorators/public.decorators';

@ApiTags('Hall Services')
@Controller('hall-service')
export class HallServicesController {
    constructor( private  readonly hallServicesService: HallServicesService) {}
    
    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all hall services' })
    async getAllHallServices() {
        const services = await this.hallServicesService.getAllHallServices();
        return {
            services,
        };
    }
    
}
