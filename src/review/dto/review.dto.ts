import { IsInt, IsString, Min, Max, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  client_id: number;

  @IsInt()
  salon_id: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
