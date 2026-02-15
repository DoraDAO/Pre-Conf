import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error(
    'Supabase configuration error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be defined in environment variables'
  );
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to handle Supabase errors
export const handleSupabaseError = (error, context = '') => {
  console.error(`Supabase error${context ? ` in ${context}` : ''}:`, error);
  
  if (error.message) {
    return {
      success: false,
      error: error.message,
      context
    };
  }
  
  return {
    success: false,
    error: 'An unexpected error occurred',
    context
  };
};
