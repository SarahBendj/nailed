import { IsNotEmpty, IsNumber } from "class-validator";

export class salonGpsDto {
    @IsNumber()
    @IsNotEmpty()
    latitude: number;
    @IsNumber()
    @IsNotEmpty()
    longitude: number;
    @IsNumber()
    @IsNotEmpty()
    distance: number;
}