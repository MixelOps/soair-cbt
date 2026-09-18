import { ArrayMinSize, IsArray, IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @IsString() examBody!: string;
  @IsString() examSubject!: string;
  @IsString() @MinLength(3) questionText!: string;
  @IsArray() @ArrayMinSize(2) options!: string[];
  @IsInt() @Min(0) correctIndex!: number;
}