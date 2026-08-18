import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { CandidatesService } from './candidates.service.js';
import { CreateCandidateDto } from './dto/create-candidate.dto.js';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/types/role.enum.js';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard)
  create(@Req() req: Request, @Body() dto: CreateCandidateDto) {
    const userId = (req as any).user.id;
    return this.candidatesService.create(userId, dto);
  }

  @Get()
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMINISTRATOR, Role.EXAMINATION_OFFICER)
  findAll() {
    return this.candidatesService.findAll();
  }
}