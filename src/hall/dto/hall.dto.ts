import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HallType } from '@prisma/client';

/** Payload for creating a hall (JSON body or parsed from multipart "data") */
export class CreateHallDto {
  @ApiProperty({ example: 'Salle des fêtes Alger' })
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  wilaya?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  commune?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ enum: HallType, default: HallType.SALLE })
  @IsOptional()
  @IsEnum(HallType)
  type?: HallType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  price_day?: number;

  @ApiPropertyOptional({ description: 'ISO time or HH:mm' })
  @IsOptional()
  @IsString()
  interval_day_from?: string;

  @ApiPropertyOptional({ description: 'ISO time or HH:mm' })
  @IsOptional()
  @IsString()
  interval_day_to?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  price_evening?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  interval_evening_from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  interval_evening_to?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ description: 'Array of hall service IDs or names', default: [] })
  @IsOptional()
  @IsArray()
  hall_services?: unknown[];
}

/** Multipart body: optional "data" JSON string or flat CreateHallDto fields */
export class CreateHallBodyDto extends CreateHallDto {
  @ApiPropertyOptional({ description: 'When using multipart/form-data: JSON string of CreateHallDto' })
  @IsOptional()
  @IsString()
  data?: string;
}

export class HallGpsDto {
    @IsNumber()
    @IsOptional()
    latitude: number;
    @IsNumber()
    @IsOptional()
    longitude: number;
    @IsNumber()
    @IsOptional()
    distance: number;
}