
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { MedicationWizardData } from '../wizard/types';

export const useEditMedicationSave = (medicationId: string, onSuccess: () => void, onClose: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (medicationData: MedicationWizardData) => {
    setIsSubmitting(true);
    try {
      // Update basic medication info
      const { error: medicationError } = await supabase
        .from('medications')
        .update({
          medication_name: medicationData.basic.medication_name,
          classification: medicationData.basic.classification,
          high_alert: medicationData.basic.high_alert,
        })
        .eq('id', medicationId);

      if (medicationError) throw medicationError;

      // Delete existing related data
      await Promise.all([
        supabase.from('medication_indications').delete().eq('medication_id', medicationId),
        supabase.from('medication_contraindications').delete().eq('medication_id', medicationId),
        supabase.from('medication_dosing').delete().eq('medication_id', medicationId),
        supabase.from('medication_administration').delete().eq('medication_id', medicationId),
      ]);

      // Insert updated data
      if (medicationData.indications.length > 0) {
        const { error } = await supabase.from('medication_indications').insert(
          medicationData.indications.map(ind => ({ ...ind, medication_id: medicationId }))
        );
        if (error) throw error;
      }

      if (medicationData.contraindications.length > 0) {
        const { error } = await supabase.from('medication_contraindications').insert(
          medicationData.contraindications.map(contra => ({ contraindication: contra, medication_id: medicationId }))
        );
        if (error) throw error;
      }

      if (medicationData.dosing.length > 0) {
        const { error } = await supabase.from('medication_dosing').insert(
          medicationData.dosing.map(dose => ({ 
            ...dose, 
            medication_id: medicationId,
            infusion_pump_settings: dose.infusion_pump_settings as any
          }))
        );
        if (error) throw error;
      }

      const { error: adminError } = await supabase.from('medication_administration').insert({
        ...medicationData.administration,
        medication_id: medicationId,
      });

      if (adminError) throw adminError;

      toast({
        title: "Success",
        description: "Medication updated successfully",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error updating medication:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update medication",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSave,
    isSubmitting,
  };
};
