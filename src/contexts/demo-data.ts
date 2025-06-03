
import { supabase } from '@/integrations/supabase/client';

export const createDemoUser = async () => {
  try {
    // Check if demo user already exists by trying to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@inventorypro.com',
      password: 'admin123'
    });

    if (signInData.user) {
      console.log('Demo user already exists and can log in');
      // Sign out after checking
      await supabase.auth.signOut();
      return true;
    }

    if (signInError?.message !== 'Invalid login credentials') {
      console.error('Error checking demo user:', signInError);
      return false;
    }

    // Demo user doesn't exist, create it
    console.log('Creating demo user...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@inventorypro.com',
      password: 'admin123',
      options: {
        data: {
          name: 'Demo Admin',
          business_type: 'medical',
          business_name: 'Demo Medical Business',
          role: 'owner'
        }
      }
    });

    if (signUpError) {
      console.error('Error creating demo user:', signUpError);
      return false;
    }

    if (signUpData.user) {
      console.log('Demo user created successfully');
      // Sign out after creation
      await supabase.auth.signOut();
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error in createDemoUser:', error);
    return false;
  }
};
