import type { User } from './types/user.type';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class UserService {
  constructor(private supabaseService: SupabaseService) {}

  async saveUser(user: User) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(
        `err inserting in supabase: ${error.message}`,
      );
    }
    if (!data) {
      throw new BadRequestException('user could not be saved');
    }

    return data as User;
  }

  async findUser(email: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw new BadRequestException('user not found');

    return data as User;
  }
}
