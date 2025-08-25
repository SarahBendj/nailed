import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { salonGpsDto } from "src/salon/dto/salon.dto";

export class CreateServiceDto {

    @IsString()
    @IsNotEmpty ()
    name: string

    @IsString()  
    @IsNotEmpty ()
    price: string

    @IsNumber()   
    @IsNotEmpty ()
    duration: string

    @IsNumber()
    salon_id: number
  
}

export class serviceGpsDto extends salonGpsDto {
    @IsString()
    @IsNotEmpty()
    service: string;
}

export class UpdateServiceDto  extends  PartialType(CreateServiceDto) {
}

