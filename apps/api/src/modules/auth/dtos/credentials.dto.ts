import { IsNotEmpty, Length } from 'class-validator';

export class CredentialsDto {
  @IsNotEmpty()
  public username!: string;

  @IsNotEmpty()
  @Length(8)
  public password!: string;
}
