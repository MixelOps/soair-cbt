import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { WorkstationsService } from './workstations.service.js';
import { CreateWorkstationDto } from './dto/create-workstation.dto.js';
import { UpdateWorkstationStatusDto } from './dto/update-workstation-status.dto.js';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/types/role.enum.js';

@Controller('workstations')
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMINISTRATOR, Role.EXAMINATION_OFFICER)
export class WorkstationsController {
  constructor(private readonly workstationsService: WorkstationsService) {}

  @Post()
  create(@Body() dto: CreateWorkstationDto) {
    return this.workstationsService.create(dto);
  }

  @Get()
  findAll() {
    return this.workstationsService.findAll();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateWorkstationStatusDto) {
    return this.workstationsService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMINISTRATOR)
  delete(@Param('id') id: string) {
    return this.workstationsService.delete(id);
  }
}