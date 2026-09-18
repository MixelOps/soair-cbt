import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import { VerifyDto } from './dto/verify.dto.js';
import { SubmitDto } from './dto/submit.dto.js';

@Injectable()
export class KioskService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private async findCandidate(candidateNo: string, accessCode: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('candidates')
      .select('*')
      .eq('candidate_no', candidateNo)
      .eq('access_code', accessCode)
      .single();

    if (error || !data) {
      throw new UnauthorizedException('Invalid candidate number or access code');
    }
    return data;
  }

  async verify(dto: VerifyDto) {
    const candidate = await this.findCandidate(dto.candidateNo, dto.accessCode);

    if (candidate.completed_at) {
      throw new UnauthorizedException('This exam has already been completed');
    }

    const client = this.supabaseService.getClient();
    const { data: questions, error } = await client
      .from('questions')
      .select('id, question_text, options')
      .eq('exam_body', candidate.exam_body)
      .eq('exam_subject', candidate.exam_subject);

    if (error) throw error;

    return {
      candidate: { fullName: candidate.full_name, candidateNo: candidate.candidate_no },
      questions: questions ?? [],
    };
  }

  async submit(dto: SubmitDto) {
    const candidate = await this.findCandidate(dto.candidateNo, dto.accessCode);

    const client = this.supabaseService.getClient();
    const { data: questions, error } = await client
      .from('questions')
      .select('id, correct_index')
      .eq('exam_body', candidate.exam_body)
      .eq('exam_subject', candidate.exam_subject);

    if (error) throw error;

    let correct = 0;
    for (const q of questions ?? []) {
      if (dto.answers[q.id] === q.correct_index) correct++;
    }
    const score = questions?.length ? Math.round((correct / questions.length) * 100) : 0;

    const { error: updateError } = await client
      .from('candidates')
      .update({ score, completed_at: new Date().toISOString() })
      .eq('id', candidate.id);

    if (updateError) throw updateError;

    return { score, totalQuestions: questions?.length ?? 0, correctAnswers: correct };
  }
}