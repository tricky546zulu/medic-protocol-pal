
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Medication = Database['public']['Tables']['medications']['Row'];
type DosingData = Database['public']['Tables']['medication_dosing']['Row'];
type IndicationData = Database['public']['Tables']['medication_indications']['Row'];

export const medicationService = {
  async getAllMedications(): Promise<Medication[]> {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .order('medication_name');

    if (error) throw error;
    return data || [];
  },

  async getMedicationById(id: string): Promise<Medication | null> {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getAllDosing(): Promise<DosingData[]> {
    const { data, error } = await supabase
      .from('medication_dosing')
      .select('*');
    
    if (error) throw error;
    return data || [];
  },

  async getAllIndications(): Promise<IndicationData[]> {
    const { data, error } = await supabase
      .from('medication_indications')
      .select('*');
    
    if (error) throw error;
    return data || [];
  },

  searchMedications(searchTerm: string, medications: Medication[], indications: IndicationData[]): Medication[] {
    if (!searchTerm) return medications;

    const searchLower = searchTerm.toLowerCase();
    return medications.filter(med => {
      // Search by medication name
      const nameMatch = med.medication_name.toLowerCase().includes(searchLower);
      
      // Search by indications
      const medicationIndications = indications.filter(ind => ind.medication_id === med.id);
      const indicationMatch = medicationIndications.some(ind => 
        ind.indication_text.toLowerCase().includes(searchLower)
      );
      
      return nameMatch || indicationMatch;
    });
  },
};
