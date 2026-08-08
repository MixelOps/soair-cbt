import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service.js';
import { SupabaseAuthGuard } from './common/guards/supabase-auth.guard.js';
import { RolesGuard } from './common/guards/roles.guard.js';
import { Roles } from './common/decorators/roles.decorator.js';
import { Role } from './common/types/role.enum.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('admin-check')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  adminCheck(): string {
    return 'You are authenticated and authorized as a super admin.';
  }
}