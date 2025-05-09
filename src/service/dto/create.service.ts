import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateServiceDto {

    @IsString()
    @IsNotEmpty ()
    name: string

    @IsString()  
    @IsNotEmpty ()
    price: string

    @IsString()   
    @IsNotEmpty ()
    duration: string

    @IsNumber()
    salon_id: number
  
}

export class UpdateServiceDto  extends  PartialType(CreateServiceDto) {
    @IsNumber()
    @IsNotEmpty()
    id: number
}

