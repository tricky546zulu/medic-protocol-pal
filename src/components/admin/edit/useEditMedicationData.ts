
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MedicationWizardData } from '../wizard/types';

export const useEditMedicationData = (medicationId: string, isOpen: boolean) => {
  const [medicationData, setMedicationData] = useState<MedicationWizardData>({
    basic: { medication_name: '', classification: [], high_alert: false },
    indications: [],
    contraindications: [],
    dosing: [],
    administration: { preparation: [], administration_notes: [], monitoring: [], adverse_effects: [] },
  });

  // Fetch medication data
  const { data: medication, isLoading } = useQuery({
    queryKey: ['edit-medication', medicationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('id', medicationId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!medicationId,
  });

  const { data: indications } = useQuery({
    queryKey: ['edit-indications', medicationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medication_indications')
        .select('*')
        .eq('medication_id', medicationId);
      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!medicationId,
  });

  const { data: contraindications } = useQuery({
    queryKey: ['edit-contraindications', medicationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medication_contraindications')
        .select('*')
        .eq('medication_id', medicationId);
      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!medicationId,
  });

  const { data: dosing } = useQuery({
    queryKey: ['edit-dosing', medicationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medication_dosing')
        .select('*')
        .eq('medication_id', medicationId);
      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!medicationId,
  });

  const { data: administration } = useQuery({
    queryKey: ['edit-administration', medicationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medication_administration')
        .select('*')
        .eq('medication_id', medicationId);
      if (error) throw error;
      return data?.[0] || null; // Return null if no data found
    },
    enabled: isOpen && !!medicationId,
  });

  // Update local state when data is loaded
  useEffect(() => {
    if (medication && indications !== undefined && contraindications !== undefined && dosing !== undefined && administration !== undefined) {
      console.log('Setting medication data - administration:', administration);
      setMedicationData({
        basic: {
          medication_name: medication.medication_name,
          classification: medication.classification || [],
          high_alert: medication.high_alert || false,
        },
        indications: indications?.map(ind => ({
          indication_type: ind.indication_type,
          indication_text: ind.indication_text,
        })) || [],
        contraindications: contraindications?.map(contra => contra.contraindication) || [],
        dosing: dosing?.map(dose => {
          console.log('Processing dosing item:', dose);
          console.log('Infusion pump settings:', dose.infusion_pump_settings);
          return {
            patient_type: dose.patient_type,
            indication: dose.indication,
            dose: dose.dose,
            route: dose.route,
            provider_routes: dose.provider_routes || [],
            concentration_supplied: dose.concentration_supplied,
            compatibility_stability: dose.compatibility_stability || [],
            notes: dose.notes || [],
            requires_infusion_pump: dose.requires_infusion_pump || false,
            infusion_pump_settings: dose.infusion_pump_settings as any || {
              cca_setting: '',
              line_option: 'A',
              duration: '',
              vtbi: '',
              pump_instructions: '',
              medication_selection: '',
            },
          };
        }) || [],
        administration: {
          preparation: administration?.preparation || [],
          administration_notes: administration?.administration_notes || [],
          monitoring: administration?.monitoring || [],
          adverse_effects: administration?.adverse_effects || [],
        },
      });
    }
  }, [medication, indications, contraindications, dosing, administration]);

  const updateData = <K extends keyof MedicationWizardData>(stepKey: K, data: MedicationWizardData[K]) => {
    setMedicationData(prev => ({ ...prev, [stepKey]: data }));
  };

  return {
    medicationData,
    updateData,
    medication,
    isLoading,
  };
};
