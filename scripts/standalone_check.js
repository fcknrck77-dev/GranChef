const { createClient } = require('@supabase/supabase-js');

async function check() {
  const url = "https://vprlwusrkmbbjqytogyf.supabase.co";
  const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcmx3dXNya21iYmpxeXRvZ3lmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzg2MTIwOSwiZXhwIjoyMDg5NDM3MjA5fQ.wNQhoESfq064I6bEybEGCy0Sus4tHwfBQEK_DlFzcZk";
  
  const client = createClient(url, key);
  
  console.log('--- Full Error Diagnostic ---');
  const { data, error } = await client.from('culinary_knowledge').select('*').limit(1);
  if (error) {
    console.log('ERROR_OBJ:', JSON.stringify(error, null, 2));
  } else {
    console.log('SUCCESS: Data fetched.');
  }
}
check();
