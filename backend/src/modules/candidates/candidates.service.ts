import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import { CreateCandidateDto } from './dto/create-candidate.dto.js';

@Injectable()
export class CandidatesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(userId: string, dto: CreateCandidateDto) {
    const client = this.supabaseService.getClient();
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
        exam_body: dto.examBody,
        exam_subject: dto.examSubject,
        preferred_date: dto.preferredDate,
        candidate_no: candidateNo,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}