import { IsDateString, IsInt, IsString, Min } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  examBody!: string;

  @IsString()
  examSubject!: string;

  @IsDateString()
  sessionDate!: string;

  @IsInt()
  @Min(1)
  capacity!: number;
}