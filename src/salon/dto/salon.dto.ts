import { IsNumber, IsOptional } from "class-validator";

export class salonGpsDto {
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