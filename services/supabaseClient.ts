import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("🚨 Error Crítico: Faltan variables de entorno de Supabase");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
