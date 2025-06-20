
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
  { id: 'basic', title: 'Basic Information', component: BasicInfoStep },
  { id: 'indications', title: 'Indications', component: IndicationsStep },
  { id: 'contraindications', title: 'Contraindications', component: ContraindicationsStep },
  { id: 'dosing', title: 'Dosing & Routes', component: DosingStep },
  { id: 'administration', title: 'Administration', component: AdministrationStep },
  { id: 'review', title: 'Review & Submit', component: ReviewStep },
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

  const updateData = (stepKey: keyof MedicationWizardData, data: any) => {
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

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              index < currentStep 
                ? 'bg-green-600 text-white' 
                : index === currentStep 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <span className={`ml-2 text-sm ${
              index <= currentStep ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-12 h-px mx-4 ${
                index < currentStep ? 'bg-green-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">{currentStep + 1} of {steps.length}</Badge>
            {steps[currentStep].title}
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
          Previous
        </Button>
        <Button
          onClick={nextStep}
          disabled={!canProceed() || currentStep === steps.length - 1}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
