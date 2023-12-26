import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uhtcismmkslrwcqleogv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVodGNpc21ta3NscndjcWxlb2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMzNjQ3ODIsImV4cCI6MjAxODk0MDc4Mn0.2iXPWWugrUNjn1RjgjdrJ0JFvlscsMP1OjLcjm2GBM8';

export const supabase = createClient(supabaseUrl, supabaseKey);
