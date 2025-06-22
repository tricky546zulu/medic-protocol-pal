import { supabase } from '@/integrations/supabase/client';
import { enhancedMedicationService } from './enhancedMedicationService';
import type { Database } from '@/integrations/supabase/types';

type Medication = Database['public']['Tables']['medications']['Row'];
type DosingData = Database['public']['Tables']['medication_dosing']['Row'];
type IndicationData = Database['public']['Tables']['medication_indications']['Row'];

export const medicationService = {
  // Use enhanced service methods with caching
  ...enhancedMedicationService,
  
  // Keep original method signatures for backward compatibility
  async getAllMedications(): Promise<Medication[]> {
    return enhancedMedicationService.getAllMedications();
  },

  async getMedicationById(id: string): Promise<Medication | null> {
    return enhancedMedicationService.getMedicationById(id);
  },

  async getAllDosing(): Promise<DosingData[]> {
    return enhancedMedicationService.getAllDosing();
  },

  async getAllIndications(): Promise<IndicationData[]> {
    return enhancedMedicationService.getAllIndications();
  },

  searchMedications(searchTerm: string, medications: Medication[], indications: IndicationData[]): Medication[] {
    return enhancedMedicationService.searchMedications(searchTerm, medications, indications);
  },
};
