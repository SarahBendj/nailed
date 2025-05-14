import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAvailibilityDto {
    @IsNumber()
    @IsNotEmpty()
    salon_id: number;

    @IsString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsNotEmpty()
    start_time: string;
    @IsString()
    @IsNotEmpty()
    end_time: string;

    @IsOptional()
    @IsString()
    note: string;
}

export class UpdateAvailibilityDto extends CreateAvailibilityDto {}
