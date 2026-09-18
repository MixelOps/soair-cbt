import { IsString } from 'class-validator';

export class VerifyDto {
  @IsString()
  candidateNo!: string;

  @IsString()
  accessCode!: string;
}