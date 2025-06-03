
import { supabase } from '@/integrations/supabase/client';

export const createDemoUser = async () => {
  // Check if demo user already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', 'demo-user-id')
    .single();

  if (!existingProfile) {
    // Create demo profile if it doesn't exist
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: 'demo-user-id',
        name: 'Demo Admin',
        business_type: 'medical',
        business_name: 'Demo Medical Business',
        role: 'owner'
      });

    if (error) {
      console.error('Error creating demo user:', error);
    }
  }
};
