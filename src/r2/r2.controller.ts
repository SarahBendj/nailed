import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Owner')
@Controller('owner/r2')
export class R2Controller {}
