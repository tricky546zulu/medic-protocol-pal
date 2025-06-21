
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { BasicInfoStep } from './wizard/BasicInfoStep';
import { IndicationsStep } from './wizard/IndicationsStep';
import { ContraindicationsStep } from './wizard/ContraindicationsStep';
import { DosingStep } from './wizard/DosingStep';
import { AdministrationStep } from './wizard/AdministrationStep';
import { toast } from '@/hooks/use-toast';
import type { MedicationWizardData, EditMedicationProps } from './wizard/types';

const steps = [
  { id: 'basic', title: 'Basic Information', shortTitle: 'Basic' },
  { id: 'indications', title: 'Indications', shortTitle: 'Indications' },
  { id: 'contraindications', title: 'Contraindications', shortTitle: 'Contra' },
  { id: 'dosing', title: 'Dosing & Routes', shortTitle: 'Dosing' },
  { id: 'administration', title: 'Administration', shortTitle: 'Admin' },
];

const stepComponents = [
  BasicInfoStep,
  IndicationsStep,
  ContraindicationsStep,
  DosingStep,
  AdministrationStep,
];

export const EditMedicationModal = ({ medicationId, isOpen, onClose, onSuccess }: EditMedicationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      return data?.[0];
    },
    enabled: isOpen && !!medicationId,
  });

  // Update local state when data is loaded
  useEffect(() => {
    if (medication && indications && contraindications && dosing && administration) {
      setMedicationData({
        basic: {
          medication_name: medication.medication_name,
          classification: medication.classification || [],
          high_alert: medication.high_alert || false,
        },
        indications: indications.map(ind => ({
          indication_type: ind.indication_type,
          indication_text: ind.indication_text,
        })),
        contraindications: contraindications.map(contra => contra.contraindication),
        dosing: dosing.map(dose => ({
          patient_type: dose.patient_type,
          indication: dose.indication,
          dose: dose.dose,
          route: dose.route,
          provider_routes: dose.provider_routes || [],
          concentration_supplied: dose.concentration_supplied,
          compatibility_stability: dose.compatibility_stability || [],
          notes: dose.notes || [],
          requires_infusion_pump: dose.requires_infusion_pump || false,
          infusion_pump_settings: dose.infusion_pump_settings as any || {},
        })),
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

  const canProceed = () => {
    switch (currentStep) {
      case 0: return medicationData.basic.medication_name.trim() !== '';
      case 1: return medicationData.indications.length > 0;
      case 2: return true;
      case 3: return medicationData.dosing.length > 0;
      case 4: return true;
      default: return false;
    }
  };

  const handleSave = async () => {
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
          medicationData.dosing.map(dose => ({ ...dose, medication_id: medicationId }))
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

  const CurrentStepComponent = stepComponents[currentStep];

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="text-center py-8">Loading medication data...</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Edit Medication: {medication?.medication_name}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  index < currentStep 
                    ? 'bg-green-600 text-white'
                    : index === currentStep 
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                } hidden sm:inline`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-px mx-4 ${
                    index < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Current Step Content */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{currentStep + 1} of {steps.length}</Badge>
              <span className="font-semibold">{steps[currentStep].title}</span>
            </div>
            <CurrentStepComponent data={medicationData} updateData={updateData} />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex gap-2">
              {currentStep === steps.length - 1 ? (
                <Button onClick={handleSave} disabled={!canProceed() || isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  disabled={!canProceed()}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
