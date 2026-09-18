import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import { CreateQuestionDto } from './dto/create-question.dto.js';

@Injectable()
export class QuestionsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(dto: CreateQuestionDto) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('questions')
      .insert({
        exam_body: dto.examBody,
        exam_subject: dto.examSubject,
        question_text: dto.questionText,
        options: dto.options,
        correct_index: dto.correctIndex,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const client = this.supabaseService.getClient();
    const { error } = await client.from('questions').delete().eq('id', id);
    if (error) throw error;
    return { deleted: true };
  }
}