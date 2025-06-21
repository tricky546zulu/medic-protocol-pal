
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EditNavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
}

export const EditNavigationButtons = ({
  currentStep,
  totalSteps,
  canProceed,
  isSubmitting,
  onPrevious,
  onNext,
  onSave,
}: EditNavigationButtonsProps) => {
  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      
      <div className="flex gap-2">
        {currentStep === totalSteps - 1 ? (
          <Button onClick={onSave} disabled={!canProceed || isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!canProceed}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
