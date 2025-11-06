import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

@Injectable()
export class SupabaseService {
  constructor(
    @Inject('SUPABASE_CLIENT') private client: SupabaseClient<Database>,
  ) {}

  getClient(): SupabaseClient {
    return this.client;
  }
}
