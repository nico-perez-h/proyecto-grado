import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://atjbisxvrsjdgujtotnm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0amJpc3h2cnNqZGd1anRvdG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NDQzOTgsImV4cCI6MjA3MzEyMDM5OH0.cgfgfRWltl2ARqv0FnQUc1J_1EGCNuQzTici2VZhU_w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
