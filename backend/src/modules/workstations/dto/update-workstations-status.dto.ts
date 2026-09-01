import { IsIn } from 'class-validator';

export class UpdateWorkstationStatusDto {
  @IsIn(['available', 'in_use', 'faulty', 'maintenance'])
  status!: string;
}