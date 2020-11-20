import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  name!: string;

  @Length(4, 4)
  @IsOptional()
  code?: string;
}
