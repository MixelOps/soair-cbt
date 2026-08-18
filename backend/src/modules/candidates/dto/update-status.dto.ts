import { IsIn } from 'class-validator';

export class UpdateStatusDto {
    @IsIn(['pending', 'payment_confirmed', 'seat_assigned', 'cancelled'])
    status!: string;
}