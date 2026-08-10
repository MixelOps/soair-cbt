import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import { Role } from '../../common/types/role.enum.js';
import { SignupDto } from './dto/signup.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signup(dto: SignupDto) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      email_confirm: true, // skip email verification for now, MVP stage
      user_metadata: { fullName: dto.fullName },
      app_metadata: { role: Role.CANDIDATE },
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return { userId: data.user.id, email: data.user.email };
  }

  async login(dto: LoginDto) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error || !data.session) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      accessToken: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.app_metadata?.role,
      },
    };
  }
}