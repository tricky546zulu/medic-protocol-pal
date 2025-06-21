
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface EditProgressIndicatorProps {
  steps: Array<{ id: string; title: string; shortTitle: string }>;
  currentStep: number;
}

export const EditProgressIndicator = ({ steps, currentStep }: EditProgressIndicatorProps) => {
  return (
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
  );
};
