import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import { CreateCandidateDto } from './dto/create-candidate.dto.js';

@Injectable()
export class CandidatesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(userId: string, dto: CreateCandidateDto) {
    const client = this.supabaseService.getClient();

    const { data: session, error: sessionError } = await client
      .from('exam_sessions')
      .select('*')
      .eq('id', dto.sessionId)
      .single();

    if (sessionError || !session) {
      throw new BadRequestException('Selected exam session does not exist');
    }

    const { count, error: countError } = await client
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', dto.sessionId);

    if (countError) throw countError;

    if ((count ?? 0) >= session.capacity) {
      throw new BadRequestException('This exam session is fully booked');
    }

    const candidateNo = `2026${Math.floor(1000 + Math.random() * 9000)}`;

    const { data, error } = await client
      .from('candidates')
      .insert({
        user_id: userId,
        full_name: dto.fullName,
        phone: dto.phone,
        dob: dto.dob,
        gender: dto.gender,
        state: dto.state,
        session_id: dto.sessionId,
        exam_body: session.exam_body,
        exam_subject: session.exam_subject,
        preferred_date: session.session_date,
        candidate_no: candidateNo,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateStatus(id: string, status: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('candidates')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}