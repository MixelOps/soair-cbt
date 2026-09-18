import { BadRequestException, Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';
import { SupabaseService } from '../supabase/supabase.service.js';
import { CreateCandidateDto } from './dto/create-candidate.dto.js';

function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

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
    const accessCode = generateAccessCode();

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
        access_code: accessCode,
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

  async exportToExcel(sessionId?: string): Promise<Buffer> {
    const client = this.supabaseService.getClient();
    let query = client.from('candidates').select('*').order('full_name', { ascending: true });

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Candidates');

    sheet.columns = [
      { header: 'Candidate No.', key: 'candidate_no', width: 16 },
      { header: 'Full Name', key: 'full_name', width: 28 },
      { header: 'Phone', key: 'phone', width: 16 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'State', key: 'state', width: 16 },
      { header: 'Exam Body', key: 'exam_body', width: 14 },
      { header: 'Subject', key: 'exam_subject', width: 20 },
      { header: 'Exam Date', key: 'preferred_date', width: 14 },
      { header: 'Status', key: 'status', width: 18 },
      { header: 'Registered', key: 'created_at', width: 20 },
    ];

    sheet.getRow(1).font = { bold: true };

    for (const c of data ?? []) {
      sheet.addRow({
        candidate_no: c.candidate_no,
        full_name: c.full_name,
        phone: c.phone,
        gender: c.gender,
        state: c.state,
        exam_body: c.exam_body,
        exam_subject: c.exam_subject,
        preferred_date: c.preferred_date,
        status: c.status,
        created_at: new Date(c.created_at).toLocaleString(),
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}