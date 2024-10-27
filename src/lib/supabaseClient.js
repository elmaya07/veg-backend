// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jfkfumhualcvwgxauwuj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impma2Z1bWh1YWxjdndneGF1d3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE1NTE4NDMsImV4cCI6MjAzNzEyNzg0M30.xU5yNlyAX6RekqQl7RKnzcsHqrLvbPVLlxj9FlaMPq0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
