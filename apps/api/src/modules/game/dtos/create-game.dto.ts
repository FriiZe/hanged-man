import {
  IsInt, IsNotEmpty, IsOptional, IsUUID, Max, Min,
} from 'class-validator';

export class CreateGameDto {
  @IsUUID()
  @IsNotEmpty()
  public roomId!: string;

  @IsInt()
  @Min(0)
  @Max(5)
  @IsOptional()
  public trials?: number;
}
