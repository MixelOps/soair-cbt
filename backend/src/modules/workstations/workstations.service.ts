import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import { CreateWorkstationDto } from './dto/create-workstation.dto.js';

@Injectable()
export class WorkstationsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(dto: CreateWorkstationDto) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('workstations')
      .insert({ label: dto.label })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('workstations')
      .select('*')
      .order('label', { ascending: true });

    if (error) throw error;
    return data;
  }

  async updateStatus(id: string, status: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('workstations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const client = this.supabaseService.getClient();
    const { error } = await client.from('workstations').delete().eq('id', id);
    if (error) throw error;
    return { deleted: true };
  }
}