import { supabase } from '../../lib/supabase.js';
import {
  IUserRepository
} from '../interfaces/index.js';
import { UserProfile } from '../../types/index.js';

export class SupabaseUserRepository implements IUserRepository {
  async findById(id: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to find user by ID: ${error.message}`);
    }

    return data as UserProfile | null;
  }

  async findByEmail(email: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Failed to find user by email: ${error.message}`
      );
    }

    return data as UserProfile | null;
  }

  async findAll(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to find users: ${error.message}`);
    }

    return (data ?? []) as UserProfile[];
  }
}