import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignUpDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'customer' })
  @IsString()
  @IsNotEmpty()
  role: string;
}

export class logoutDto {
  @ApiProperty({ example: 'jwt-token-string' })
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class updatePasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

// * SALON OWNER DTO
export class SO_SignUpDto {
  @ApiProperty({ example: 'Jane Smith' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'salonowner@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'ownerPassword123' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: 'salon_owner' })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiProperty({ example: 'Glamour Salon' })
  @IsNotEmpty()
  @IsString()
  salon_name: string;

  @ApiProperty({ example: '123 Beauty St, New York, NY' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiPropertyOptional({ example: 40.7128 })
  @IsOptional()
  @IsNumber({}, { message: 'Latitude must be a number' })
  latitude?: number;

  @ApiPropertyOptional({ example: -74.0060 })
  @IsOptional()
  @IsNumber({}, { message: 'Longitude must be a number' })
  longitude?: number;

  @ApiPropertyOptional({ example: '+1-202-555-0123' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Best salon in town' })
  @IsOptional()
  @IsString()
  description?: string;


}

