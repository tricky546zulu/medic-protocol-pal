
import { supabase } from '@/integrations/supabase/client';
import { cacheManager } from '@/utils/cacheManager';
import type { Database } from '@/integrations/supabase/types';

type Medication = Database['public']['Tables']['medications']['Row'];
type DosingData = Database['public']['Tables']['medication_dosing']['Row'];
type IndicationData = Database['public']['Tables']['medication_indications']['Row'];

export const enhancedMedicationService = {
  async getAllMedications(): Promise<Medication[]> {
    const cacheKey = 'medications:all';
    const cached = cacheManager.get<Medication[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .order('medication_name');

    if (error) throw error;
    
    const medications = data || [];
    cacheManager.set(cacheKey, medications, 10 * 60 * 1000); // 10 minutes
    
    return medications;
  },

  async getMedicationById(id: string): Promise<Medication | null> {
    const cacheKey = `medication:${id}`;
    const cached = cacheManager.get<Medication>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    if (data) {
      cacheManager.set(cacheKey, data, 15 * 60 * 1000); // 15 minutes
    }
    
    return data;
  },

  async getAllDosing(): Promise<DosingData[]> {
    const cacheKey = 'dosing:all';
    const cached = cacheManager.get<DosingData[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const { data, error } = await supabase
      .from('medication_dosing')
      .select('*');
    
    if (error) throw error;
    
    const dosing = data || [];
    cacheManager.set(cacheKey, dosing, 10 * 60 * 1000); // 10 minutes
    
    return dosing;
  },

  async getAllIndications(): Promise<IndicationData[]> {
    const cacheKey = 'indications:all';
    const cached = cacheManager.get<IndicationData[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const { data, error } = await supabase
      .from('medication_indications')
      .select('*');
    
    if (error) throw error;
    
    const indications = data || [];
    cacheManager.set(cacheKey, indications, 10 * 60 * 1000); // 10 minutes
    
    return indications;
  },

  // Invalidate cache when medications are modified
  invalidateCache(medicationId?: string): void {
    if (medicationId) {
      cacheManager.invalidate(`medication:${medicationId}`);
    }
    cacheManager.invalidatePattern('medications:');
    cacheManager.invalidatePattern('dosing:');
    cacheManager.invalidatePattern('indications:');
  },

  // Preload critical data
  async preloadCriticalData(): Promise<void> {
    try {
      await Promise.all([
        this.getAllMedications(),
        this.getAllDosing(),
        this.getAllIndications(),
      ]);
    } catch (error) {
      console.error('Failed to preload critical data:', error);
    }
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
