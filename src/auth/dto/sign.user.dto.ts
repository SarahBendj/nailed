import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';


export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    name : string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    password: string; 

    @IsString()
    @IsNotEmpty()
    role: string;
}

export class logoutDto {
    @IsNotEmpty()
    @IsString()
    token: string;
}

//*SALON OWNER  DTO

export class SO_SignUpDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsString()
  salon_name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsNumber({}, { message: 'Latitude must be a number' })
  latitude?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Longitude must be a number' })
  longitude?: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  description?: string;


  @IsOptional()
  @IsNumber()
  user_id?: number;
}


