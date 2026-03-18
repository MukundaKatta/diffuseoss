import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      generations: {
        Row: {
          id: string;
          created_at: string;
          prompt: string;
          negative_prompt: string;
          params: Record<string, unknown>;
          image_url: string;
          user_id: string | null;
        };
        Insert: Omit<Database['public']['Tables']['generations']['Row'], 'id' | 'created_at'>;
      };
      embeddings_cache: {
        Row: {
          id: string;
          text: string;
          vector: number[];
          model: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['embeddings_cache']['Row'], 'id' | 'created_at'>;
      };
      training_data: {
        Row: {
          id: string;
          image_url: string;
          caption: string;
          source: string;
          tags: string[];
          aesthetic_score: number;
          clip_score: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['training_data']['Row'], 'id' | 'created_at'>;
      };
    };
  };
}
