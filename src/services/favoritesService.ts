
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Medication = Database['public']['Tables']['medications']['Row'];

export const favoritesService = {
  async getUserFavorites(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('medication_id')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data?.map(fav => fav.medication_id) || [];
  },

  async getFavoriteMedications(userId: string): Promise<Medication[]> {
    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        id,
        created_at,
        medications (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data?.map(fav => fav.medications).filter(Boolean) as Medication[];
  },

  async addFavorite(userId: string, medicationId: string): Promise<void> {
    const { error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: userId,
        medication_id: medicationId,
      });

    if (error) throw error;
  },

  async removeFavorite(userId: string, medicationId: string): Promise<void> {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('medication_id', medicationId);

    if (error) throw error;
  },

  async checkIfFavorite(userId: string, medicationId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('medication_id', medicationId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },
};
