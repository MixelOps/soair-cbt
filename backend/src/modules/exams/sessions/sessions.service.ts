import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service.js';
import { CreateSessionDto } from './dto/create-session.dto.js';

@Injectable()
export class SessionsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(dto: CreateSessionDto) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('exam_sessions')
      .insert({
        exam_body: dto.examBody,
        exam_subject: dto.examSubject,
        session_date: dto.sessionDate,
        capacity: dto.capacity,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('exam_sessions')
      .select('*')
      .order('session_date', { ascending: true });

    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const client = this.supabaseService.getClient();
    const { error } = await client.from('exam_sessions').delete().eq('id', id);
    if (error) throw error;
    return { deleted: true };
  }

  async findCandidates(id: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('candidates')
      .select('*')
      .eq('session_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}