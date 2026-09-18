import { IsObject, IsString } from 'class-validator';

export class SubmitDto {
  @IsString()
  candidateNo!: string;

  @IsString()
  accessCode!: string;

  @IsObject()
  answers!: Record<string, number>;
}