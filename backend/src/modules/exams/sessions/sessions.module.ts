import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller.js';
import { SessionsService } from './sessions.service.js';
import { SupabaseModule } from '../../supabase/supabase.module.js';

@Module({
  imports: [SupabaseModule],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}