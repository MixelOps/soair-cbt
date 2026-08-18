import { IsDateString, IsString, MinLength } from 'class-validator';

export class CreateCandidateDto {
  @IsString() @MinLength(2) fullName!: string;
  @IsString() @MinLength(7) phone!: string;
  @IsDateString() dob!: string;
  @IsString() gender!: string;
  @IsString() state!: string;
  @IsString() examBody!: string;
  @IsString() examSubject!: string;
  @IsDateString() preferredDate!: string;
}