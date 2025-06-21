
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { BasicInfoStep } from './wizard/BasicInfoStep';
import { IndicationsStep } from './wizard/IndicationsStep';
import { ContraindicationsStep } from './wizard/ContraindicationsStep';
import { DosingStep } from './wizard/DosingStep';
import { AdministrationStep } from './wizard/AdministrationStep';
import { EditProgressIndicator } from './edit/EditProgressIndicator';
import { EditNavigationButtons } from './edit/EditNavigationButtons';
import { useEditMedicationData } from './edit/useEditMedicationData';
import { useEditMedicationSave } from './edit/useEditMedicationSave';
import type { EditMedicationProps } from './wizard/types';

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
  
  const { medicationData, updateData, medication, isLoading } = useEditMedicationData(medicationId, isOpen);
  const { handleSave, isSubmitting } = useEditMedicationSave(medicationId, onSuccess, onClose);

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
          <EditProgressIndicator steps={steps} currentStep={currentStep} />

          {/* Current Step Content */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{currentStep + 1} of {steps.length}</Badge>
              <span className="font-semibold">{steps[currentStep].title}</span>
            </div>
            <CurrentStepComponent data={medicationData} updateData={updateData} />
          </div>

          <EditNavigationButtons
            currentStep={currentStep}
            totalSteps={steps.length}
            canProceed={canProceed()}
            isSubmitting={isSubmitting}
            onPrevious={() => setCurrentStep(Math.max(0, currentStep - 1))}
            onNext={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            onSave={() => handleSave(medicationData)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
