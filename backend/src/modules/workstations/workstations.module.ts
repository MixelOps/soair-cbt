import { Module } from '@nestjs/common';
import { WorkstationsController } from './workstations.controller.js';
import { WorkstationsService } from './workstations.service.js';
import { SupabaseModule } from '../supabase/supabase.module.js';

@Module({
  imports: [SupabaseModule],
  controllers: [WorkstationsController],
  providers: [WorkstationsService],
})
export class WorkstationsModule {}