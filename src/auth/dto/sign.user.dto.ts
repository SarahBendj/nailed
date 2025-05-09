import { IsEmail, IsNotEmpty, IsString } from 'class-validator';


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

