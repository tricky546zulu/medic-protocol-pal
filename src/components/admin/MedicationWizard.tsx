
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { BasicInfoStep } from './wizard/BasicInfoStep';
import { IndicationsStep } from './wizard/IndicationsStep';
import { ContraindicationsStep } from './wizard/ContraindicationsStep';
import { DosingStep } from './wizard/DosingStep';
import { AdministrationStep } from './wizard/AdministrationStep';
import { ReviewStep } from './wizard/ReviewStep';
import type { MedicationWizardData } from './wizard/types';

const steps = [
  { id: 'basic', title: 'Basic Information', shortTitle: 'Basic' },
  { id: 'indications', title: 'Indications', shortTitle: 'Indications' },
  { id: 'contraindications', title: 'Contraindications', shortTitle: 'Contra' },
  { id: 'dosing', title: 'Dosing & Routes', shortTitle: 'Dosing' },
  { id: 'administration', title: 'Administration', shortTitle: 'Admin' },
  { id: 'review', title: 'Review & Submit', shortTitle: 'Review' },
];

const stepComponents = [
  BasicInfoStep,
  IndicationsStep,
  ContraindicationsStep,
  DosingStep,
  AdministrationStep,
  ReviewStep,
];

export const MedicationWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [medicationData, setMedicationData] = useState<MedicationWizardData>({
    basic: {
      medication_name: '',
      classification: [],
      high_alert: false,
    },
    indications: [],
    contraindications: [],
    dosing: [],
    administration: {
      preparation: [],
      administration_notes: [],
      monitoring: [],
      adverse_effects: [],
    },
  });

  const updateData = <K extends keyof MedicationWizardData>(stepKey: K, data: MedicationWizardData[K]) => {
    setMedicationData(prev => ({
      ...prev,
      [stepKey]: data,
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return medicationData.basic.medication_name.trim() !== '';
      case 1: // Indications
        return medicationData.indications.length > 0;
      case 2: // Contraindications
        return true; // Optional step
      case 3: // Dosing
        return medicationData.dosing.length > 0;
      case 4: // Administration
        return true; // Optional step
      case 5: // Review
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = stepComponents[currentStep];

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="w-full overflow-x-auto">
        <div className="flex items-center justify-between min-w-fit px-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium shrink-0 ${
                index < currentStep 
                  ? 'bg-green-600 text-white'
                  : index === currentStep 
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className={`ml-2 text-sm whitespace-nowrap ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-500'
              } hidden sm:inline`}>
                {step.title}
              </span>
              <span className={`ml-2 text-xs whitespace-nowrap ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-500'
              } sm:hidden`}>
                {step.shortTitle}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 sm:w-12 h-px mx-2 sm:mx-4 shrink-0 ${
                  index < currentStep ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Badge variant="outline" className="shrink-0">{currentStep + 1} of {steps.length}</Badge>
            <span className="truncate">{steps[currentStep].title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CurrentStepComponent
            data={medicationData}
            updateData={updateData}
          />
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </Button>
        <Button
          onClick={nextStep}
          disabled={!canProceed() || currentStep === steps.length - 1}
          className="flex items-center gap-2"
        >
          <span className="hidden sm:inline">Next</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
