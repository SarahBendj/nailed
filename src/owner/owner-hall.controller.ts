import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { Roles } from '../common/decorators/roles.decorators';
import { JwtAuthGuard } from '../common/guards/jwt.guards';
import { RolesGuard } from '../common/guards/roles.guards';
import { HallService } from '../hall/hall.service';

@ApiTags('Owner')
@Controller('owner/hall')
export class OwnerHallController {
  constructor(private readonly hallService: HallService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: multer.memoryStorage(),
      limits: { files: 10 },
    }),
  )
  async createHall(@Body() body: any, @Req() req: any) {
    const userId = req.user.user_id;
    const files = req.files as Express.Multer.File[];
    const data =
      typeof body.data === 'string' ? JSON.parse(body.data) : body;
    const hall = await this.hallService.createHall(userId, data, files);
    return {
      message: 'Hall created successfully',
      hall,
    };
  }

  @Get('my-halls')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  async getMyHalls(@Req() req: any) {
    const id = req.user.user_id;
    return this.hallService.getHallById(Number(id));
  }

  @Patch('desactivate/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  async desactivateHall(@Param('id') id: number) {
    if (!id) {
      return { message: 'Salon ID is required' };
    }
    const salon = await this.hallService.desactivateSalon(id);
    return {
      message: 'Salon desactivated successfully',
      salon,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  async deleteHall(@Param('id') id: number, @Body() body: { password?: string }) {
    const password = body?.password;
    if (!password) {
      return { message: 'Password is required' };
    }
    if (!id) {
      return { message: 'Salon ID is required' };
    }
    const salon = await this.hallService.deleteSalon(id, password);
    return {
      message: 'Salon deleted successfully',
      salon,
    };
  }
}
