import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { CandidatesService } from './candidates.service.js';
import { CreateCandidateDto } from './dto/create-candidate.dto.js';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard.js';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard)
  create(@Req() req: Request, @Body() dto: CreateCandidateDto) {
    const userId = (req as any).user.id;
    return this.candidatesService.create(userId, dto);
  }
}