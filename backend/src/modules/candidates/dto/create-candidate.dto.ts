import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateCandidateDto {
  @IsString() @MinLength(2) fullName!: string;
  @IsString() @MinLength(7) phone!: string;
  @IsString() dob!: string;
  @IsString() gender!: string;
  @IsString() state!: string;
  @IsUUID() sessionId!: string;
}