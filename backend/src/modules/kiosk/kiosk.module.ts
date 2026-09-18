import { Module } from '@nestjs/common';
import { KioskController } from './kiosk.controller.js';
import { KioskService } from './kiosk.service.js';
import { SupabaseModule } from '../supabase/supabase.module.js';

@Module({
  imports: [SupabaseModule],
  controllers: [KioskController],
  providers: [KioskService],
})
export class KioskModule {}