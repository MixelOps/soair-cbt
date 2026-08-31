import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SessionsService } from './sessions.service.js';
import { CreateSessionDto } from './dto/create-session.dto.js';
import { SupabaseAuthGuard } from '../../../common/guards/supabase-auth.guard.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { Roles } from '../../../common/decorators/roles.decorator.js';
import { Role } from '../../../common/types/role.enum.js';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMINISTRATOR, Role.EXAMINATION_OFFICER)
  create(@Body() dto: CreateSessionDto) {
    return this.sessionsService.create(dto);
  }

  @Get()
  @UseGuards(SupabaseAuthGuard)
  findAll() {
    return this.sessionsService.findAll();
  }
}