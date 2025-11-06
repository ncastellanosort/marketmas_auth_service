import { Module } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { ConfigService } from '@nestjs/config';
import { Database } from './types';

@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: (configService: ConfigService): SupabaseClient<Database> => {
        const url = configService.get<string>('SUPABASE_URL');
        const key = configService.get<string>('SUPABASE_SERVICE_ROL_KEY');

        if (!url || !key) {
          throw new Error('Supabase environment variables not found');
        }

        return createClient<Database>(url, key);
      },
      inject: [ConfigService],
    },
    SupabaseService,
  ],
  exports: ['SUPABASE_CLIENT', SupabaseService],
})
export class SupabaseModule {}
