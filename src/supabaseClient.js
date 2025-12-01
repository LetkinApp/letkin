import { createClient } from '@supabase/supabase-js'

// REPLACE THE TEXT INSIDE THE QUOTES WITH YOUR KEYS FROM STEP 1
const supabaseUrl = 'https://lffhvajyfygzhgbpqgjh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZmh2YWp5ZnlnemhnYnBxZ2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MDQ4NzYsImV4cCI6MjA4MDA4MDg3Nn0.YX5E3Idv-G_DpbTYW5KwXYcGgvC7541QSI9M75XHVGk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)