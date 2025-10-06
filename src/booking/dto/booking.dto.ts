import { IsString, IsNotEmpty, IsEnum, IsNumber} from "class-validator"

export class createReservationDTO {
    
    @IsNotEmpty()
    @IsString()
    client_id : string;

    @IsNotEmpty()
    @IsString()
    salon_id  : string;

    @IsNotEmpty()
    @IsString()
    service_id : string;

    @IsNotEmpty()
    @IsString()
    start_time : string;

    @IsNotEmpty()
    @IsString()
    end_time : string;

    @IsNotEmpty()
    @IsString()
    date : string;

    
    
}
export class updateReservationDTO {
    
    @IsNotEmpty()
    @IsNumber()
    id ?: number ;

    @IsNotEmpty()
    @IsNumber()
    booking_id ?: number ;

    @IsNotEmpty()
    @IsString()
    status ?:string;
}